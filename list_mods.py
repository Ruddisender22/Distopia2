import json

with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for cat in data:
    print(f"[{cat.get('name', 'UNKNOWN')}]")
    for mod in cat.get('mods', []):
        print(f"  - {mod.get('name', 'UNKNOWN')}")
