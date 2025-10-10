import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../src")))

from main import check_sign, describe_number

def test_integration_check_and_describe():
    assert describe_number(10) == f"The number 8 is {check_sign(10)}"
    assert describe_number(-10) == f"The number 8 is {check_sign(-10)}"
    assert describe_number(0) == f"The number 8 is {check_sign(0)}"
