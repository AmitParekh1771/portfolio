import BM25 from "okapibm25";

const qnas = [
  {
    "id": "1",
    "question": "I want to create a dynamic website that stands out.",
    "answer": "Absolutely! I'll craft a dynamic website that not only stands out visually but also offers interactive features. By combining striking design elements with smooth animations, your website will leave a lasting impression on visitors."
  },
  {
    "id": "2",
    "question": "I want to modernize my legacy software.",
    "answer": "No problem! I'll carefully analyze your legacy software, identify outdated components, and create a modernization strategy. Through code refactoring and integrating contemporary technologies, we'll transform your software into a robust and efficient solution."
  },
  {
    "id": "3",
    "question": "I want to enhance my website's accessibility.",
    "answer": "Accessibility is key! I'll ensure your website is inclusive and user-friendly for all. By adhering to WCAG guidelines, implementing alt text, and optimizing keyboard navigation, we'll make sure everyone can engage with your content seamlessly."
  },
  {
    "id": "4",
    "question": "I want to integrate a third-party API into my application.",
    "answer": "Absolutely, I'll seamlessly integrate the desired third-party API into your application. Whether it's payment gateways, social media, or other services, I'll ensure smooth communication, proper error handling, and data security."
  },
  {
    "id": "5",
    "question": "I want to develop a custom plugin for my CMS.",
    "answer": "You're in the right place! I'll create a custom plugin tailored to your CMS. This plugin will add the exact functionalities you need, ensuring compatibility, efficient code, and a seamless user experience."
  },
  {
    "id": "6",
    "question": "I want to migrate my data to the cloud.",
    "answer": "Absolutely! I'll plan a smooth migration strategy, moving your data to the cloud while ensuring data integrity and security. With scalable cloud solutions, your data will be easily accessible and well-protected."
  },
  {
    "id": "7",
    "question": "I want to optimize my website's images for better performance.",
    "answer": "Images matter for performance! I'll optimize your images through compression and responsive design techniques. This will result in faster load times, improved user experience, and efficient use of bandwidth."
  },
  {
    "id": "8",
    "question": "I want to implement real-time features in my app.",
    "answer": "Exciting! I'll integrate real-time functionalities like chat, notifications, or collaborative editing into your app using WebSockets or other appropriate technologies. Your users will experience seamless and up-to-the-minute interactions."
  },
  {
    "id": "9",
    "question": "I want to create a seamless omnichannel experience.",
    "answer": "Absolutely, I'll unify your brand's presence across various platforms, ensuring consistent design and functionality. This will provide your users with a seamless experience whether they're on a website, mobile app, or any other platform."
  },
  {
    "id": "10",
    "question": "I want to redesign my e-commerce website for better conversions.",
    "answer": "Redesign for success! I'll analyze user behavior, implement persuasive design elements, and optimize the checkout process to boost conversions. Your redesigned e-commerce website will entice customers and increase sales."
  },
]

const answerRef = document.getElementById('answer');
const questionRef = document.getElementById('question');
const questionsBox = document.getElementById('questions-box');
const overlay = document.getElementById('overlay');
const sendBtn = document.getElementById('send-btn');

let currentSelected = 0;
let debounce;

const typer = async (elRef, text, delay, speed) => {
  elRef.innerText = '';
  const textWords = text.split(' '), n = textWords.length;
  let counter = 0;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const typer = setInterval(() => {
        if(counter >= n) {
          clearInterval(typer);
          resolve();
          return;
        }
        elRef.innerText += ` ${textWords[counter++]}`;
      }, speed);
    }, delay);
  })
}

const topN = (n = 0) => {
  let questions = qnas.map(qna => qna.question);
  let a = BM25(questions, questionRef.value.split(' '), { k1: 1.3, b: 0.9 }), res = [];
  
  for(let i = 0 ; i < (n || a.length) ; i++) {
    for(let j = a.length-i-1 ; j > 0 ; j--) {
      if(a[j] > a[j-1]) {
        let temp = a[j];
        a[j] = a[j-1];
        a[j-1] = temp;

        temp = qnas[j];
        qnas[j] = qnas[j-1];
        qnas[j-1] = temp;  
      }
    }
    res.push(qnas[i]);
  }

  return res;
}

const liTemplate = (qna) => `<li data-id="${qna.id}" class="p-4 cursor-pointer hover:bg-gray-300 hover:text-gray-700">${qna.question}</li>`;

const showAutoSuggest = () => {
  questionsBox.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

const hideAutoSuggest = () => {
  questionsBox.classList.add('hidden');
  overlay.classList.add('hidden');

  currentSelected = 0;
}

const showAnswer = (index = 0) => {
  hideAutoSuggest();
  questionRef.value = qnas[index].question;
  typer(answerRef, qnas[index].answer, 1000, 100);
  topN(0);
}

const listDown = () => {
  const list = questionsBox.getElementsByTagName('li');

  for(let item of list) {
    if(item.classList.contains('bg-gray-300')) {
      if(item != list[list.length-1]) {
        item.classList.remove('bg-gray-300', 'text-gray-700');
        item.nextElementSibling.classList.add('bg-gray-300', 'text-gray-700');
        return item.nextElementSibling;
      } else return item;
    }
  }

  list[0].classList.add('bg-gray-300', 'text-gray-700');
  return list[0];
}

const listUp = () => {
  const list = questionsBox.getElementsByTagName('li');

  for(let item of list) {
    if(item.classList.contains('bg-gray-300')) {
      if(item != list[0]) {
        item.classList.remove('bg-gray-300', 'text-gray-700');
        item.previousElementSibling.classList.add('bg-gray-300', 'text-gray-700');
        return item.previousElementSibling;
      } else return item;
    }
  }
}

questionRef.addEventListener('input', (ev) => {
  if(debounce) clearTimeout(debounce);

  questionsBox.classList.contains('hidden') ? showAutoSuggest() : null;

  debounce = setTimeout(() => {
    questionsBox.innerHTML = '';
    const autoSuggestQna = topN(0);
    for(let qna of autoSuggestQna) questionsBox.insertAdjacentHTML('beforeend', liTemplate(qna));
    questionsBox.scrollTo({ top: 0 })
  }, 500);

});

questionRef.addEventListener('focus', (ev) => showAutoSuggest());

questionRef.addEventListener('keydown', (ev) => {
  if(ev.key == 'Enter') showAnswer(currentSelected);
  
  if(ev.key == 'ArrowDown' || ev.key == 'ArrowUp') {
    let curr;
    if(ev.key == 'ArrowDown') curr = listDown(); 
    if(ev.key == 'ArrowUp') curr = listUp(); 
  
    if(curr) {
      curr.scrollIntoView({ block: 'nearest' });
      const id = curr.getAttribute('data-id') || '1';
      const index = qnas.findIndex(qna => qna.id == id);
      if(index != -1) {
        questionRef.value = qnas[index].question;
        currentSelected = index;
      }
    }
  }
});

sendBtn.addEventListener('click', (ev) => {
  showAnswer(currentSelected);
});

questionsBox.addEventListener('click', (ev) => {
  const targets = ev.composedPath();

  for(let target of targets) {
    if(target == questionsBox) return;

    if(target.hasAttribute('data-id')) {
      const id = target.getAttribute('data-id') || '1';
      const index = qnas.findIndex(qna => qna.id == id);
      if(index != -1) showAnswer(index);
    }
  }
});

overlay.addEventListener('click', (ev) => {
  hideAutoSuggest();
});

for(let qna of qnas) questionsBox.insertAdjacentHTML('beforeend', liTemplate(qna));
typer(answerRef, qnas[0].answer, 1000, 100);