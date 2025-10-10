import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../src")))
from main import check_sign, describe_number

def test_check_sign():
    assert check_sign(10) == "positive"
    assert check_sign(-10) == "negative"
    assert check_sign(0) == "zero"

def test_describe_number():
    assert describe_number(10) ==  "The number 10 is positive."
    assert describe_number(-10) ==  "The number -10 is negative."
    assert describe_number(0) ==  "The number 0 is zero."