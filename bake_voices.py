# -*- coding: utf-8 -*-
"""edge-tts 语音预烘焙：为北境湖全部配音分段生成 MP3 并更新 voice_manifest.js
键格式与 game.js sceneCacheKey 一致：voice|rate+pitch+volume|text
文件名 = md5(key).mp3（与既有清单一致）
旁白分段对全部 6 条声线生成（玩家可选任意旁白声线）
"""
import asyncio
import hashlib
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import edge_tts

PLAY = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'web', 'play')
VOICE_DIR = os.path.join(PLAY, 'voice')
MANIFEST = os.path.join(PLAY, 'voice_manifest.js')

# 与 game.js VOICE_HINT_MAP / EMOTION_PROSODY 完全一致
HINT_VOICE = {
    "young_f":  "zh-CN-XiaoxiaoNeural",
    "lively_f": "zh-CN-XiaoyiNeural",
    "mature_f": "zh-CN-XiaoxuanNeural",
    "young_m":  "zh-CN-YunxiNeural",
    "mature_m": "zh-CN-YunyangNeural",
    "rough_m":  "zh-CN-YunjianNeural",
}
ALL_VOICES = sorted(set(HINT_VOICE.values()))
PROSODY = {
    "calm":    ("+0%",  "+0Hz",  "+0%"),
    "happy":   ("+8%",  "+14Hz", "+0%"),
    "excited": ("+14%", "+18Hz", "+0%"),
    "angry":   ("+12%", "+8Hz",  "+15%"),
    "sad":     ("-14%", "-14Hz", "-10%"),
    "fear":    ("+10%", "+20Hz", "-5%"),
    "tense":   ("+6%",  "+4Hz",  "+0%"),
    "cold":    ("-4%",  "-8Hz",  "+0%"),
    "whisper": ("-12%", "-6Hz",  "-35%"),
    "serious": ("-2%",  "-4Hz",  "+0%"),
}
CAST = json.loads(open(os.path.join(PLAY, 'voice_cast.js'), encoding='utf-8')
                  .read().split('window.VOICE_CAST = ')[1].split(';')[0])

def pro_str(emotion):
    r, p, v = PROSODY[emotion]
    return r + p + v

def key_of(voice, emotion, text):
    return f"{voice}|{pro_str(emotion)}|{text}"

def fname(key):
    return hashlib.md5(key.encode('utf-8')).hexdigest() + ".mp3"

def collect_jobs():
    d = json.load(open(os.path.join(PLAY, 'cases.json'), encoding='utf-8'))
    jobs = {}  # key -> (voice, rate, pitch, vol, text)
    for wid, cases in d['cases'].items():
        for case in cases:
            for node in case.get('nodes', []):
                for seg in node.get('segments', []):
                    sp, hint, emo, text = seg['speaker'], seg.get('voice_hint', ''), seg.get('emotion', 'calm'), seg['text']
                    if emo not in PROSODY:
                        emo = 'calm'
                    if not sp:
                        voices = ALL_VOICES            # 旁白：玩家可任选声线
                    elif sp in CAST:
                        voices = [CAST[sp]]
                    else:
                        continue                        # 未分配角色跳过（沿用运行时动态分配的兜底）
                    for v in voices:
                        k = key_of(v, emo, text)
                        fp = os.path.join(VOICE_DIR, fname(k))
                        if os.path.exists(fp) and os.path.getsize(fp) > 200:
                            continue                     # 已烘焙
                        r, p, vol = PROSODY[emo]
                        jobs[k] = (v, r, p, vol, text)
    return jobs

async def synth(key, args):
    voice, rate, pitch, vol, text = args
    out = os.path.join(VOICE_DIR, fname(key))
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, volume=vol)
    await communicate.save(out)
    return out

async def main():
    jobs = collect_jobs()
    print(f"待合成: {len(jobs)} 段")
    sem = asyncio.Semaphore(4)
    done, fail = 0, []
    async def run(k, a):
        nonlocal done
        async with sem:
            try:
                await synth(k, a)
                done += 1
                if done % 10 == 0:
                    print(f"  进度 {done}/{len(jobs)}")
            except Exception as e:
                fail.append((k, str(e)))
    await asyncio.gather(*(run(k, a) for k, a in jobs.items()))
    print(f"完成 {done}，失败 {len(fail)}")
    for k, e in fail[:5]:
        print("FAIL:", k[:60], e)

    # 合并清单
    import re
    old = {}
    if os.path.exists(MANIFEST):
        js = open(MANIFEST, encoding='utf-8').read()
        m = re.search(r'window\.VOICE_MANIFEST = (\{.*\})\s*;?\s*$', js, re.S)
        if m:
            old = json.loads(m.group(1))
    # 全量重建（含跳过的已存在文件）
    d = json.load(open(os.path.join(PLAY, 'cases.json'), encoding='utf-8'))
    manifest = dict(old)
    for wid, cases in d['cases'].items():
        for case in cases:
            for node in case.get('nodes', []):
                for seg in node.get('segments', []):
                    sp, hint, emo, text = seg['speaker'], seg.get('voice_hint', ''), seg.get('emotion', 'calm'), seg['text']
                    if emo not in PROSODY:
                        emo = 'calm'
                    if not sp:
                        voices = ALL_VOICES
                    elif sp in CAST:
                        voices = [CAST[sp]]
                    else:
                        continue
                    for v in voices:
                        k = key_of(v, emo, text)
                        fp = os.path.join(VOICE_DIR, fname(k))
                        if os.path.exists(fp) and os.path.getsize(fp) > 200:
                            manifest[k] = 'voice/' + fname(k)
    with open(MANIFEST, 'w', encoding='utf-8') as f:
        f.write('/* 预烘焙语音清单（构建期生成，勿手改） */\n')
        f.write('window.VOICE_MANIFEST = ' + json.dumps(manifest, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print(f"清单条目: {len(manifest)}")

if __name__ == '__main__':
    asyncio.run(main())
