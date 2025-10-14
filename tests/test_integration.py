import time
import os

def test_integration_smoke():
    # 模擬打到外部服務前的基本檢查
    env = os.getenv("TEST_ENV", "unknown")
    assert env in ("staging", "production")
    time.sleep(0.1)
    assert 1 + 1 == 2
