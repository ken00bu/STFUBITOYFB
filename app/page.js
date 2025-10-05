'use client';
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TextCursor from "@/public/components/reactbit/cursor/cursor";
import wait from "@/lib/wait/wait";
import { stagger } from "motion";

export default function Home() {
  const tulisan = [ 's', "t", "f", "u", "b"];
  const [ renderH5, setRenderH5 ] = useState([]);
  const videoRef = useRef();
  const buttonRef = useRef();
  const [ font, setFont ] = useState(["font-chivo-regular", "font-bitcount-single", "font-bitcount-double", "font-pinyon-script"]);
  const [ fontInLetter, setFontInLetter ] = useState(()=>{
    return Array(tulisan.length).fill("font-pinyon-script")
  });


  useGSAP(()=>{
    
    const tl = gsap.timeline({repeat: -1});
    tl.to({}, {
      duration: 0.1,
      onComplete: async()=>{
        setFontInLetter((prev)=>{
          const randomFont = font[Math.floor(Math.random() * font.length)];
          const newFontInLetter = [...prev];
          const randomIndex = Math.floor(Math.random() * newFontInLetter.length);
          newFontInLetter[randomIndex] = randomFont;
          return newFontInLetter
        })
      }
    })

     const tls = gsap.timeline({repeat: -1, repeatDelay: 0.1, yoyo: true, });
      gsap.set(".word", {
            scaleY: 2,
            scaleX: 1.2,
      })
        tls.to(".word", {
            scaleY: 2,
            scaleX: 1.2,
            filter: "blur(0px)",
            ease: "expo",
            duration: 1,
      }).to(".word", {
            scaleY: 7,
            scaleX: 1.5,
            filter: "blur(0px)",
            ease: "expo",
            duration: 1,
      })

      const tlw = gsap.timeline();
      gsap.set(".getridofmylife", { opacity: 0 })
      tlw.to(".getridofmylife", {
        opacity: 1,
        stagger: {
          each: 0.01,
          from: "random"
        },
        duration: 0.01,
        onComplete: async()=>{

          const tletter = gsap.timeline({repeat: -1, repeatDelay: 0.1, repeatRefresh: true});
          tletter.set(".getridofmylife", {
            top: (_, target) => {
              const pos = getRandomPosition(); // fungsi tadi yg return {top, left}
              target.dataset.randTop = pos.top;  // simpan biar left bisa pakai sama
              target.dataset.randLeft = pos.left;
              return `${pos.top}%`;
            },
            left:(i, target) => {
              return `${target.dataset.randLeft}%`; // pake hasil yg sama dari atas
            },
            stagger: {
              each: 0.01,
              from: "random"
            }
          })
        }
      })

  }, {dependencies: [renderH5]})

  const PlayVideo = () =>{
    if(videoRef.current){
      videoRef.current.play();
    }
  }

  function getRandomPosition() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const batasAtas = isMobile ? 30 : 10;
    const batasBawah = isMobile ? 70 : 90;
    const side = Math.floor(Math.random() * 4);
    let top, left;
    if (side === 0) { // atas
        top = Math.floor(Math.random() * batasAtas);
        left = Math.floor(Math.random() * 80) + 10;
      } else if (side === 1) { // bawah
        top = Math.floor(Math.random() * batasAtas) + batasBawah;
        left = Math.floor(Math.random() * 80) + 10;
      } else if (side === 2) { // kiri
        left = Math.floor(Math.random() * 10);
        top = Math.floor(Math.random() * 80) + 10;
      } else { // kanan
        left = Math.floor(Math.random() * 10) + 80;
        top = Math.floor(Math.random() * 80) + 10;
      }
      return { top, left };
    }


  useEffect(()=>{
    const total = 50
    const newArray = []
    for (let i = 0; i < total; i++){
      const result = getRandomPosition();
      newArray.push(result);
    }
    setRenderH5(newArray);
  }, [])
  

  return (
    <div onClick={PlayVideo} className="w-screen min-h-[100dvh] flex overflow-hidden">
      <div className="absolute w-screen h-screen object-fill z-50 fixed">
          {renderH5.map((item, index)=>(
            
            <h5 key={index} 
              className="text-white font-inter text-[0.2rem] lg:text-[1rem] getridofmylife"
              style={{
                position: 'absolute',
                top: `${item.top}%`,
                left: `${item.left}%`
              }}
            
            >
              GET OUT OF MY LIFE
            </h5>
          ) )}
      </div>
      <video src="/STFUB.mp4" ref={videoRef} autoPlay loop playsInline className=" w-full h-[150vh] object-fill -z-30 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></video>
      <div className="w-full min-h-[100dvh] flex flex-col justify-center items-center bg-black/40 ">
          <h1 className={`text-white text-4xl lg:text-[13rem] flex gap-1 items-center word`} >
            {tulisan.map((item, index)=>(
              <span key={index} className={`${fontInLetter[index]}`} >{item === '  ' ? '\u00A0' : item}</span>
            ))}
          </h1>
          
      </div>
      
      
      
    </div>
  );
}

//jadi pertama kita harus render tulisan kenobu berdasarkan urutan indeks. kemudian kita bikin state yang panjangnya sesuai panjang tulisan kenobu ini jadi acuan font indeks tersebut.
//setiap 2 detik, kita bakalan update state font di index acak dengan font acak.