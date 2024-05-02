let slides=document.querySelectorAll(".slide");
let counter=0;
slides.forEach((slide,index)=>{
    slide.style.left = `${index * 100}%`;
});
let goNext=()=>{
    if(counter<slides.length-1){
        counter++;
        slideImage();
    }
}
let goPrev=()=>{
    if(counter!=0){
        counter--;
        slideImage()
    }
}
const slideImage=()=>{
    slides.forEach(
        (slide)=>{
            slide.style.transform = `translateX(-${counter * 100}%)`;
        }
    )
}