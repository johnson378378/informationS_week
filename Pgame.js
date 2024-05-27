let isSecondAttempt = false;

function startGame() {
    const userInput = document.getElementById('userInput').value;
    const message = document.getElementById('message');

    // 清空上次的提示信息
    message.innerText = '';

    if (!isSecondAttempt && /^\d{7}$/.test(userInput)) {
        // 第一次要求輸入恰好7位純數字
        attemptCrack(userInput, 7);
    } else if (isSecondAttempt && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).{10,}$/.test(userInput)) {
        // 第二次要求輸入至少10位，且包含數字、英文大小寫及特殊符號的密碼
        message.innerText = '不錯!!!這密碼強度很夠，來吧給你答案 Answer3 : A';
    } else {
        message.innerText = isSecondAttempt ? '7位數字太容易被破解，請使用(輸入)10位以上包含數字+小寫英文+大寫英文+特殊符號的高強度密碼' : '請輸入7位數字密碼(純數字)';
    }
}

function attemptCrack(userInput, length) {
    const startTime = Date.now();
    const userHash = hashPassword(userInput);
    let cracked = false;

    function tryCrack() {
        const charset = '0123456789';
        const maxAttempts = Math.pow(charset.length, length);
        for (let i = 0; i < maxAttempts; i++) {
            const randomPassword = generateRandomPassword(length, charset);
            const randomHash = hashPassword(randomPassword);
            if (userHash === randomHash) {
                const elapsedTime = Date.now() - startTime;
                const elapsedTimeInSeconds = elapsedTime / 1000;
                message.innerText = `慘了，我只花 ${elapsedTimeInSeconds.toFixed(5)} 秒破解出你的密碼: ${userInput}. \n請改成使用(輸入)10位以上包含數字+小寫英文+大寫英文+特殊符號的高強度密碼`;
                isSecondAttempt = true;
                cracked = true;
                return;
            }
        }
        if (!cracked) {
            requestAnimationFrame(tryCrack);
        }
    }

    tryCrack();
}

function generateRandomPassword(length, charset) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
}

function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
