(this["webpackJsonpgr-20"]=this["webpackJsonpgr-20"]||[]).push([[8],{400:function(e,t,n){"use strict";n.r(t),n.d(t,"exportMapToPDF",(function(){return s})),n.d(t,"addPDFTextToCanvas",(function(){return l})),n.d(t,"getMultiStagePDF",(function(){return p})),n.d(t,"getCurrentViewPDF",(function(){return f}));var r=n(157),a=n.n(r),o=n(158),i=n(401),c=n(53),u=n(184),s=function(){var e=Object(o.a)(a.a.mark((function e(t,n){var r,c,s,l,p,f=arguments;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=f.length>2&&void 0!==f[2]?f[2]:"a4",c=f.length>3&&void 0!==f[3]?f[3]:150,s=!(f.length>4&&void 0!==f[4])||f[4],l=f.length>5&&void 0!==f[5]?f[5]:null,p=f.length>6&&void 0!==f[6]?f[6]:function(e){},e.abrupt("return",new Promise(function(){var e=Object(o.a)(a.a.mark((function e(o){var f,d,h,g,v,w,m;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n||(n=new i.a("landscape",void 0,r)),f=u.a[r],d=t.getSize(),h=t.getView().calculateExtent(d),g=Math.round(f[0]*c/25.4),v=Math.round(f[1]*c/25.4),w=[g,v],m=t.getView().getResolution(),t.once("rendercomplete",(function(){var e=document.createElement("canvas");e.width=g,e.height=v;var r=e.getContext("2d");if(r){var a;Array.prototype.forEach.call(document.querySelectorAll(".ol-layer canvas"),(function(e){if(e.width>0){var t=e.parentNode.style.opacity;r.globalAlpha=""===t?1:Number(t);var n=e.style.transform.match(/^matrix\(([^(]*)\)$/)[1].split(",").map(Number);CanvasRenderingContext2D.prototype.setTransform.apply(r,n),r.drawImage(e,0,0)}})),p(e);var i=e.toDataURL("image/jpeg");null===(a=n)||void 0===a||a.addImage(i,"JPEG",0,0,f[0],f[1])}s&&(t.setSize(d),t.getView().fit(l||h,{size:d}),t.getView().setResolution(m)),o(n)})),t.setSize(w),t.getView().fit(l||h,{size:w});case 11:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 6:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),l=function(e,t,n){var r=e.getContext("2d");r&&(r.font="16px Arial",r.fillStyle="black",r.shadowColor="black",r.shadowBlur=7,r.lineWidth=5,r.fillText("\xa9 OpenStreetMap contributors \xa9 koenverhoeven on Wikiloc ",6,e.height-4),r.shadowBlur=0,r.fillStyle="white",r.fillText("\xa9 OpenStreetMap contributors \xa9 koenverhoeven on Wikiloc ",5,e.height-5),r.shadowBlur=0,r.fillStyle="white",r.fillText("".concat(t.getProperties().name," to ").concat(n.getProperties().name),5,20))},p=function(){var e=Object(o.a)(a.a.mark((function e(t,n,r,o,i,u){var p,f,d,h;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:p=o.slice(0,-1),i(),f=void 0,d=a.a.mark((function e(i){var u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u=Object(c.b)([o[i].getGeometry().getCoordinates(),o[i+1].getGeometry().getCoordinates()]),e.next=3,s(t,f,n,r,!1,u,(function(e){l(e,o[i],o[i+1])}));case 3:f=e.sent,i<o.length-2&&f.addPage();case 5:case"end":return e.stop()}}),e)})),h=0;case 5:if(!(h<p.length)){e.next=10;break}return e.delegateYield(d(h),"t0",7);case 7:h++,e.next=5;break;case 10:return u(),e.abrupt("return",f);case 12:case"end":return e.stop()}}),e)})));return function(t,n,r,a,o,i){return e.apply(this,arguments)}}(),f=function(){var e=Object(o.a)(a.a.mark((function e(t,n,r,o,i){var c,u,l;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o(),c=t.getSize(),u=t.getView().calculateExtent(c),e.next=5,s(t,void 0,n,r,!1,u);case 5:return l=e.sent,i(),e.abrupt("return",l);case 8:case"end":return e.stop()}}),e)})));return function(t,n,r,a,o){return e.apply(this,arguments)}}()}}]);
//# sourceMappingURL=pdf-util.d19fcd3b.chunk.js.map