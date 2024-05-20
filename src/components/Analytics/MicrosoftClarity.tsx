/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-20 09:33:01
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-20 09:55:10
 * @Description: 微软统计
 */
import Script from 'next/script';

const MicrosoftClarity = () => {
  return process.env.MICROSOFT_CLARITY && process.env.NODE_ENV === 'production' ? (
    <Script
      id="microsoft-clarity"
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${process.env.MICROSOFT_CLARITY});`,
      }}
    />
  ) : null;
};

export default MicrosoftClarity;
