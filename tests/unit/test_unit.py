import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../src")))
from main import check_sign, describe_number

def test_check_sign():
    assert check_sign(10) == "positive"
    assert check_sign(-10) == "negative"
    assert check_sign(0) == "zero"