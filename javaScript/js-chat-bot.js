const chatBody = document.querySelector(".chat-body")
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message")

// 🔑 مفتاح OpenRouter الخاص بك
const API_KEY = "";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const userData = {
    message: null
}

const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div")
    div.classList.add("message", ...classes)
    div.innerHTML = content
    return div
}

// ========== دالة تنسيق النص ==========
const formatBotMessage = (text) => {
    if (!text) return "لا يوجد رد.";
    
    let formatted = text;
    
    // 1. معالجة العناوين (## عنوان)
    formatted = formatted.replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>');
    
    // 2. معالجة النص العريض (**نص**)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 3. معالجة النص المائل (*نص*)
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 4. معالجة النقاط (- نص)
    let lines = formatted.split('\n');
    let inList = false;
    let result = [];
    
    for (let line of lines) {
        if (line.trim().startsWith('- ')) {
            if (!inList) {
                result.push('<ul>');
                inList = true;
            }
            let item = line.replace('- ', '').trim();
            result.push(`<li>${item}</li>`);
        } else {
            if (inList) {
                result.push('</ul>');
                inList = false;
            }
            if (line.trim() !== '') {
                result.push(line);
            }
        }
    }
    if (inList) result.push('</ul>');
    formatted = result.join('\n');
    
    // 5. معالجة الأرقام (1. نص)
    formatted = formatted.replace(/(\d+)\. (.*?)(\n|$)/g, '<br><strong>$1.</strong> $2');
    
    // 6. تحويل الأسطر الجديدة إلى <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
}

const generateBotResponse = async (incomingMessagediv) => {
    const messageElement = incomingMessagediv.querySelector(".message-text")
    
    const requestOptions = {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            // ✅ النموذج السريع - Nemotron 3 Nano
            model: "nvidia/nemotron-3-nano-30b-a3b:free",
            messages: [
                {
                    role: "system",
                    content: "أنت مساعد ذكي ومفيد. تحدث دائماً بنفس اللغة التي يستخدمها المستخدم. إذا كتب المستخدم بالعربية، أجب بالعربية. إذا كتب بالإنجليزية، أجب بالإنجليزية. إذا كتب بالفرنسية، أجب بالفرنسية. كن مختصراً ومباشراً في إجاباتك."
                },
                {
                    role: "user",
                    content: userData.message
                }
            ],
            temperature: 0.5,
            max_tokens: 500
        })
    }
    
    try {
        const response = await fetch(API_URL, requestOptions)
        const data = await response.json()
        
        if (!response.ok) {
            throw new Error(data.error?.message || "خطأ في الاتصال")
        }
        
        let apiResponseText = data.choices[0].message.content.trim()
        
        // تطبيق التنسيق على النص
        const formattedText = formatBotMessage(apiResponseText);
        messageElement.innerHTML = formattedText;
        
        incomingMessagediv.classList.remove("thinking")
        
    } catch(error) {
        console.log(error)
        messageElement.innerText = "عذراً، حدث خطأ: " + error.message
        incomingMessagediv.classList.remove("thinking")
    }
}

const handleOutgoingMessage = (e) => {
    e.preventDefault()
    userData.message = messageInput.value.trim()
    
    if (!userData.message) return;
    
    messageInput.value = ""

    const messageContent = `<div class="message-text"></div>`
    const outgoingmessagediv = createMessageElement(messageContent, "user-message")
    outgoingmessagediv.querySelector(".message-text").textContent = userData.message
    chatBody.appendChild(outgoingmessagediv)
    
    // ✅ قللنا وقت الانتظار من 600 إلى 300 مللي ثانية
    setTimeout(() => {
        const messageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
        </svg>
        <div class="message-text">
            <div class="thinking-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>`
        
        const incomingMessagediv = createMessageElement(messageContent, "bot-message", "thinking")
        chatBody.appendChild(incomingMessagediv)
        generateBotResponse(incomingMessagediv)
    }, 300)  // ⬅️ تم التخفيض من 600 إلى 300
}

messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim()
    if (e.key === "Enter" && userMessage) {
        handleOutgoingMessage(e)
    }
})

// ========== كود الإيموجي ==========
const picker = new EmojiMart.Picker({
    theme:"light",
    skinTonePosition:"none",
    previewPosition:"none",
    onEmojiSelect: (emoji) => {
        const start = messageInput.selectionStart;
        const end = messageInput.selectionEnd;
        const text = messageInput.value;
        messageInput.value = text.substring(0, start) + emoji.native + text.substring(end);
        messageInput.focus();
    },
    onClickOutside: (e) => {
        if(e.target.id === "emoji-picker"){
            document.body.classList.toggle("show-emoji-picker")
        }
        else{
            document.body.classList.remove("show-emoji-picker")
        }
    }
})
document.querySelector(".chat-form").appendChild(picker)
// ===================================

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e))