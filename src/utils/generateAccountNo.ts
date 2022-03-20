export default function generateAccountNo(): string {

    let accountNo: string = '';
    for (let i = 0; i < 10; i++) {
        // Generate a random number between 0 and 10 (exclusive of 10)
        var num = Math.floor(Math.random()* (10 - 0)) + 0;
        accountNo = accountNo + num.toString();
    }

    return accountNo;
}