def check_sign(n):
    if n > 0:
        return "positive"
    elif n < 0:
        return "negative"
    else:
        return "zero"

def describe_number(n):
    sign = check_sign(n)
    return f"The number {n} is {sign}."