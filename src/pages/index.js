import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { css } from "@emotion/css";
import JSZip from "jszip";
export default function WorkingApp() {
  const [files, setFiles] = useState();
  const [file, setFile] = useState();
  const [changedFiles, setChangedFiles] = useState();
  const [DropFile, selectedFiles] = useState([]);
  const [newChangedFiles, setNewChangedFiles] = useState([]);
  const [newFileName, setNewFileName] = useState("detail");
  const [newFiles, setNewFiles] = useState();
  const [zipFile, setZipFile] = useState([]);
  const fileInputRef = useRef(null);
  const [Drag, setDrag] = useState(false);
  const [Down, setDown] = useState(false);
  // 드래그오버시 함수
  const handleDragOver = (e) => {
    // 파일을 새창으로 열기 차단
    e.preventDefault();
    // 버블링 차단
    e.stopPropagation();
    // 드래그 오버 시 + 아이콘
    e.dataTransfer.dropEffect = "copy";
  };
  // (1)드래그 드롭  파일 저장
  const handleDrop = (e) => {
    // 드래그 완료
    setDrag(true);

    //버블링 & 기본 동작 취소
    e.preventDefault();
    e.stopPropagation();

    //드롭한 파일 배열로 변환
    const dropdedFile = Array.from(e.dataTransfer.files);

    // 배열 정렬 도구
    const sortedFiles = dropdedFile.sort((a, b) => {
      if (a.name < b.name) {
        return -1; // a가 b보다 앞에 위치해야 함
      }
      if (a.name > b.name) {
        return 1; // b가 a보다 앞에 위치해야 함
      }
      return 0; // 순서 변경 없음
    });

    //파일 저장
    setFile(sortedFiles);

    const files = [];
    for (let i = 0; i < sortedFiles.length; i++) {
      // 미리보기 url 생성
      const fileUrls = URL.createObjectURL(sortedFiles[i]);

      // 파일 객체 생성
      files.push({
        fileName: sortedFiles[i].name,
        fileType: sortedFiles[i].type,
        fileUrls: fileUrls,
      });
    }
    setFiles(files);
  };
  // 드래그 존 클릭 시에도 업로드창 노출
  const handleClick = () => {
    fileInputRef.current.click();
  };

  // (2)클릭 업로드 파일 저장
  const FileUploader = (e) => {
    const fileList = Array.from(e.target.files); // FileList 객체를 배열로 변환
    const sortedFiles = fileList.sort((a, b) => {
      if (a.name < b.name) {
        return -1; // a가 b보다 앞에 위치해야 함
      }
      if (a.name > b.name) {
        return 1; // b가 a보다 앞에 위치해야 함
      }
      return 0; // 순서 변경 없음
    });

    setFile(sortedFiles);

    const files = [];
    for (let i = 0; i < sortedFiles.length; i++) {
      const fileUrls = URL.createObjectURL(sortedFiles[i]);
      files.push({
        fileName: sortedFiles[i].name,
        fileType: sortedFiles[i].type,
        fileUrls: fileUrls,
      });
    }
    setFiles(files);
  };
  // 파일 선택으로 선택한 파일
  const handleFileInputChange = (e) => {
    const newSelectedFiles = Array.from(e.target.files);
    selectedFiles([...newSelectedFiles]);
  };

  // 이름 변경한 파일 상태 저장
  const FileChanger = () => {
    setChangedFiles(file);
    setDown(true);
  };

  // 압축하여 파일 다운로드
  const downloadZip = async () => {
    const zip = new JSZip();

    // 각 파일을 압축 파일에 추가
    zipFile.forEach((file) => {
      zip.file(
        //파일명 설정
        file.fileName,
        //미리보기 url에서 실제 데이터 요청
        fetch(file.fileUrl).then((res) => res.blob())
        // 결과를 zip하기 위해 blob 파일로 변환 필수
      );
    });

    // zip파일 생성 -> blob 변환
    const content = await zip.generateAsync({ type: "blob" });

    // 생성된 zip파일 다운로드 링크 생성
    const downloadLink = URL.createObjectURL(content);

    // 완료된 압축파일 다운로드 링크 생성
    // 다운로드용 a 링크 생성
    const a = document.createElement("a");
    // 링크에 다운로드 링크 삽입
    a.href = downloadLink;
    // 파일명
    a.download = "changed_files.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    const newFilez = [];
    for (let i = 0; i < newChangedFiles.length; i++) {
      const fileUrls = URL.createObjectURL(newChangedFiles[i]);
      newFilez.push({
        fileName: newChangedFiles[i].name,
        fileType: newChangedFiles[i].type,
        fileUrl: fileUrls,
      });
    }

    setNewFiles(newFilez);
    setZipFile(newFilez);
  }, [newChangedFiles]);

  useEffect(() => {
    // 파일체인져 눌렀을 때 실행
    if (changedFiles) {
      const newChangedFilez = [];
      let autoNums = "";
      for (let i = 0; i < changedFiles.length; i++) {
        //파일 한자리수 일 때
        if (i < 9) {
          // png, jpg, gif 구분
          if (changedFiles[i].type === "image/png") {
            autoNums = "_0" + eval(i + 1) + ".png";
          } else if (changedFiles[i].type === "image/jpeg") {
            autoNums = "_0" + eval(i + 1) + ".jpg";
          } else if (changedFiles[i].type === "image/gif") {
            autoNums = "_0" + eval(i + 1) + ".gif";
          }
          // 파일이 10번째 파일 부터
        } else {
          if (changedFiles[i].type === "image/png") {
            autoNums = "_" + eval(i + 1) + ".png";
          } else if (changedFiles[i].type === "image/jpeg") {
            autoNums = "_" + eval(i + 1) + ".jpg";
          } else if (changedFiles[i].type === "image/gif") {
            autoNums = "_" + eval(i + 1) + ".gif";
          }
        }
        newChangedFilez.push(
          //new File은 배열 인자(blob)를 받기 때문에 배열로 감싸서 인자에 전달
          //기존 파일 데이터 + [사용자가 입력한 단어 + 자동생성 넘버링] + 기존 파일 타입
          new File([file[i]], newFileName + autoNums, {
            type: file[i].type,
          })
        );
      }
      setNewChangedFiles(newChangedFilez);
    }
  }, [changedFiles]);

  return (
    <div
      className={css`
        max-width: 100%;
        padding: 0px 20px;
      `}
    >
      <div
        className={css`
          display: flex;
          justify-content: center;
          padding-top: 10px;
        `}
      >
        <button
          className={css`
            display: ${Drag ? "none" : "block"};
            border: none;
            background: white;
            border: 1px solid black;
            border-right: none;
            border-bottom: none;
            border-left: 1px solid lightgray;
            border-top: 1px solid lightgray;
            width: 50%;
            max-width: 400px;
            min-width: 200px;
            height: auto;
            border-top-left-radius: 17px;
            border-top-right-radius: 17px;
            border-bottom-left-radius: 17px;
            border-bottom-right-radius: 17px;
            box-shadow: 4px 3px 8px -1px lightgray;
            font-size: 1.5em;
            padding: 0.2em;
            color: gray;
            position: relative;
            input {
              display: ${Drag ? "none" : "block"};
              opacity: 0;
              position: absolute;
              top: 0;
              width: 100%;
              height: 100%;
            }

            &:hover {
              opacity: 0.5px;
              border: 2px solid black;
              color: black;
              background: #fff;
            }
          `}
        >
          Upload Files
          <input
            multiple
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              FileUploader(e);
            }}
          />
        </button>
      </div>
      {files ? (
        <>
          <div
            className={css`
              display: flex;
              justify-content: center;
              padding-top: 10px;
              ${console.log("Down :", Down)}
              display: ${Down ? "none" : "box"};
            `}
          >
            <input
              type="text"
              placeholder="detail"
              onChange={(e) => {
                setNewFileName(e.target.value);
              }}
            />
            <input
              type="button"
              value="일괄변경"
              onClick={() => {
                FileChanger();
              }}
            />
          </div>

          <div className={css``}>
            <div
              className={css`
                margin: 10px auto;
                max-width: 90%;
                width: 62.5em;
                display: flex;
                flex-wrap: wrap;
                max-height: 400px;
                overflow: scroll;
                flex-direction: row;
                justify-content: flex-start;
              `}
            >
              {files.map((files, index) => {
                return (
                  <div
                    key={index}
                    className={css`
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      width: 20%;
                      max-height: 25%;
                      position: relative;
                      box-sizing: border-box;
                      height: 16vw;
                      max-height: 200px;

                      p {
                        position: absolute;
                        top: 0;
                        text-align: center;
                        background-color: black;
                        color: white;
                        width: 90%;
                        font-size: 0.8em;
                      }
                      a {
                        display: flex;
                        justify-content: center;
                        padding: 10px 10px;
                        overflow: scroll;

                        img {
                          max-width: 250px;
                          max-height: 150px;
                          overflow: scroll;
                        }
                      }
                      @media (max-width: 590px) {
                        width: 33%;
                        height: 26vw;
                      }
                    `}
                  >
                    <p>{files.fileName}</p>
                    <a href={files.fileUrls} download={files.fileName}>
                      <img src={files.fileUrls} />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={css`
              display: flex;
              justify-content: center;
              padding-top: 1.25em;
              div {
                width: 100%;
                height: ${file ? "100%" : "260px"};
                text-align: center;
                border: 2px dashed black;
                border-radius: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column-reverse;
                font-weight: bold;
                max-height: 200px;
                max-width: 900px;
                min-width: 265px;

                a {
                  width: 100%;
                  height: auto;
                  img {
                    width: 100px;
                    height: auto;
                  }
                }
                @media (max-width: 590px) {
                }
              }
            `}
          >
            <div
              id="drop-zone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleClick}
              className={css``}
            >
              Drag Your Files
              <a title="위쪽 화살표 아이콘">
                <img
                  src="/images/free-icon-upload-4939937.png"
                  alt="Your Image"
                />
              </a>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              multiple
              style={{ display: "none" }}
            />
          </div>
        </>
      )}
      {zipFile.length !== 0 && (
        <div
          className={css`
            margin: 0px auto;
            display: flex;
            justify-content: center;

            padding: 34px;
            border-top: 1px solid black;
            max-width: 1000px;
            button {
              display: block;
              border: none;
              background: white;
              border: 1px solid black;
              border-right: none;
              border-bottom: none;
              border-left: 1px solid lightgray;
              border-top: 1px solid lightgray;
              width: 50%;
              max-width: 400px;
              min-width: 200px;
              height: auto;
              border-top-left-radius: 17px;
              border-top-right-radius: 17px;
              border-bottom-left-radius: 17px;
              border-bottom-right-radius: 17px;
              box-shadow: 4px 3px 8px -1px lightgray;
              font-size: 1.5em;
              padding: 0.2em;
              position: relative;
              color: gray;
              &:hover {
                opacity: 0.5px;
                border: 2px solid black;
                color: black;
                background: #fff;
              }
            }
          `}
        >
          <button onClick={downloadZip}>File Download</button>
        </div>
      )}

      <div>
        <div
          className={css`
            margin: 10px auto;
            max-width: 90%;
            width: 62.5em;
            display: flex;
            flex-wrap: wrap;
            max-height: 400px;
            overflow: scroll;
            flex-direction: row;
            justify-content: flex-start;
          `}
        >
          {newFiles &&
            newFiles.map((files, index) => {
              return (
                <div
                  key={index}
                  className={css`
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 20%;
                    flex-wrap: wrap;
                    max-height: 25%;
                    position: relative;
                    height: 16vw;
                    max-height: 200px;

                    p {
                      position: absolute;
                      top: 0;
                      text-align: center;
                      background-color: black;
                      color: white;
                      width: 90%;
                      font-size: 0.8em;
                    }
                    a {
                      display: flex;
                      justify-content: center;
                      padding: 10px 10px;
                      overflow: scroll;

                      img {
                        max-width: 250px;
                        max-height: 150px;
                        overflow: scroll;
                      }
                    }
                    @media (max-width: 590px) {
                      height: 26vw;
                      width: 33%;
                    }
                  `}
                >
                  <p>{files.fileName}</p>
                  <a href={files.fileUrl} download={files.fileName}>
                    <img src={files.fileUrl} />
                  </a>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
