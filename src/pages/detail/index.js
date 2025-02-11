import { useEffect, useState, useRef } from "react";
import { css } from "@emotion/css";
import JSZip from "jszip";

export default function WorkingApp() {
  const [imgTags, setImgTags] = useState([]);
  const fileInputRef = useRef(null);

  const baseURL =
    "https://image.cjonstyle.net/cjupload/htmledit/ven_img/570073/와이온_스윙_코어_슬라이드/";

  const handleFileInputChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const zip = new JSZip();
    const extractedFiles = [];

    // ZIP 파일 확인
    const zipFile = selectedFiles.find((file) => file.name.endsWith(".zip"));
    if (zipFile) {
      const zipData = await zip.loadAsync(zipFile);

      for (const filename of Object.keys(zipData.files)) {
        // "__MACOSX" 및 숨김 파일 제거 + 이미지 파일만 필터링
        if (
          !filename.includes("__MACOSX") &&
          /\.(jpg|jpeg|gif|png)$/i.test(filename)
        ) {
          extractedFiles.push(filename);
        }
      }

      // 📌 **파일 정렬 개선 (숫자 순 정렬)**
      extractedFiles.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
        const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
        return numA - numB;
      });

      // 파일명 정리 없이 유지 (정렬만 수행)
      const formattedTags = extractedFiles.map((fileName) => {
        return `<img src="${baseURL}${fileName}" style="vertical-align: baseline; border: 0px solid #000000" />`;
      });

      setImgTags(formattedTags);
    }
  };

  return (
    <div
      className={css`
        max-width: 100%;
        padding: 20px;
      `}
    >
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".zip"
        />
      </div>

      {imgTags.length > 0 && (
        <div>
          <h3>📸 생성된 태그:</h3>
          <pre
            className={css`
              background: #f4f4f4;
              padding: 10px;
              border-radius: 5px;
              white-space: pre-wrap;
            `}
          >
            {imgTags.join("\n")}
          </pre>
        </div>
      )}
    </div>
  );
}
