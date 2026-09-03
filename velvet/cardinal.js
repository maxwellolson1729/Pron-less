const demo=document.querySelector('.shuffle-demo');
const replay=document.querySelector('.replay');
function playShuffle(){demo.classList.remove('play');void demo.offsetWidth;demo.classList.add('play')}
replay.addEventListener('click',playShuffle);
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;playShuffle();observer.unobserve(entry.target)}),{threshold:.35});
observer.observe(demo);
const responses={yes:'Glad to hear that! Congrats on figuring it out. The next level will be much easier.',no:"I sowwy :( but I bet you learned something right? That must make things better! No, you're right. Didn't think so. I made the next level way easier for you <3"};
const response=document.querySelector('#fair-response');
const continueButton=document.querySelector('#continue-button');
document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-answer]').forEach(item=>item.classList.remove('selected'));button.classList.add('selected');response.textContent=responses[button.dataset.answer];continueButton.classList.add('visible')}));
