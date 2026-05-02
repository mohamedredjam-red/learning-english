const wordText = document.querySelector(".word");
const inputField = document.querySelector(".input");
const refreshBtn = document.querySelector(".refresh-word");
const checkBtn = document.querySelector(".check-word");
const hintText = document.querySelector(".hint span");
const timeText = document.querySelector(".time span b");  // ✅ إضافة عنصر الوقت

let correctWord, timer;
let currentTime;  // ✅ متغير لتخزين الوقت الحالي

const initTimer = (maxTime) => {
    // ✅ إيقاف أي مؤقت سابق
    if (timer) clearInterval(timer);
    
    currentTime = maxTime;
    timeText.innerText = currentTime;  // ✅ عرض الوقت
    
    timer = setInterval(() => {
        if (currentTime > 0) {  // ✅ تصحيح الأقواس
            currentTime--;
            timeText.innerText = currentTime;
        } else {
            // ✅ انتهى الوقت
            clearInterval(timer);
            alert("Time's up! Game over!");
            initGame();  // ✅ بدء لعبة جديدة
        }
    }, 1000);
}

const initGame = () => {
    initTimer(30);  // ✅ بدء المؤقت بـ 30 ثانية
    
    let randomObj = words[Math.floor(Math.random() * words.length)];
    let wordArray = randomObj.word.split("");
    
    // خلط الأحرف
    for (let i = wordArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    
    wordText.innerText = wordArray.join('');
    hintText.innerText = randomObj.hint;
    correctWord = randomObj.word.toLowerCase();
    inputField.value = '';
    inputField.setAttribute("maxlength", correctWord.length);
}

const checkWord = () => {
    let userWord = inputField.value.toLowerCase();
    
    if (userWord === "") {
        alert("Please enter a word!");
        return;
    }
    
    if (userWord !== correctWord) {
        alert(`Oops! ${userWord} is not a correct word`);
        return;
    }
    
    // ✅ إجابة صحيحة
    alert(`Congrats! ${userWord.toUpperCase()} is a correct word! 🎉`);
    clearInterval(timer);  // ✅ إيقاف المؤقت
    initGame();
}

// تشغيل اللعبة
initGame();

// الأزرار
refreshBtn.addEventListener("click", () => {
    clearInterval(timer);  // ✅ إيقاف المؤقت القديم
    initGame();
});
checkBtn.addEventListener("click", checkWord);