import re

def strip_think_block(text: str) -> str:
    """Remove <think>...</think> blocks from text"""
    return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()