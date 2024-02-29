import BM25 from "okapibm25";

const qnas = [
  {
    "id": "1",
    "question": "I want to turn my design into an Angular application.",
    "answer": "I'll help you turn your Figma/XD design into an efficient and scalable Angular code. With my experience in building user interfaces, I can collaborate effectively with you to translate your design into a functional app. I'll maintain industry standards and best practices for maintainable and readable code."
  },
  {
    "id": "2",
    "question": "I want to improve performance of my Angular application.",
    "answer": "I can analyze your application and identify performance bottlenecks. I'll use techniques like lazy loading, code splitting, and change detection optimization to improve responsiveness and user experience."
  },
  {
    "id": "3",
    "question": "I want to integrate an external API into my Angular application.",
    "answer": "I'm familiar with various API integration techniques in Angular. I can help you fetch data, handle responses, and seamlessly integrate the API into your application logic."
  },
  {
    "id": "4",
    "question": "I want to implement state management in my Angular application.",
    "answer": "I can you on developing the most suitable state management solution for your application, like NgRx or Redux. I'll help implement the chosen approach effectively to manage application state."
  },
  {
    "id": "5",
    "question": "I want to make my Angular application more secure",
    "answer": "I can help implement security best practices like proper data validation, user authentication and authorization, and secure communication protocols to protect your application from vulnerabilities."
  },
  {
    "id": "6",
    "question": "I want to implement unit and integration testing in my Angular application.",
    "answer": "I have experience with testing frameworks like Jest and Jasmine. I can help you set up a testing environment, write comprehensive unit and integration tests, and ensure code quality and maintainability."
  },
  {
    "id": "3",
    "question": "I need help debugging and fixing errors in my Angular code.",
    "answer": "Debugging errors in Angular applications can involve various factors. I can leverage my experience to assist you in troubleshooting effectively, utilizing debugging tools (like the Angular CLI or the browser's developer console), analyzing error messages, and applying methodical problem-solving techniques to resolve the issues accurately and efficiently."
  },
  {
    "id": "8",
    "question": "I need to deploy my Angular application.",
    "answer": "I can help you choose a suitable deployment strategy based on your needs. I'm familiar with various deployment platforms like Firebase, Netlify, and AWS, and can guide you through the deployment process."
  },
  {
    "id": "9",
    "question": "I want to improve the SEO of my Angular application.",
    "answer": "I can help you implement SEO best practices in your Angular application, including proper use of meta tags, title tags, and structured data. I can also guide you on optimizing your content and ensuring crawlability by search engines."
  },
  {
    "id": "10",
    "question": "I want a freelance Angular developer to join out team for ongoing projects.",
    "answer": "I'm available for ongoing maintenance and development tasks. I can help you fix bugs, implement new features, and keep your application up-to-date with the latest Angular versions and best practices."
  }
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
      const timer = setInterval(() => {
        if(counter >= n) {
          clearInterval(timer);
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