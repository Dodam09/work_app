import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { css } from "@emotion/css";
import JSZip from "jszip";
export default function WorkingApp() {
  const [files, setFiles] = useState();
  const [file, setFile] = useState();
  const [changedFiles, setChangedFiles] = useState();
  const [DropFile, setDropFile] = useState([]);
  const [newChangedFiles, setNewChangedFiles] = useState([]);
  const [newFileName, setNewFileName] = useState("detail");
  const [newFiles, setNewFiles] = useState();
  const [zipFile, setZipFile] = useState([]);
  const fileInputRef = useRef(null);
  const [Drag, setDrag] = useState(false);
  const [Down, setDown] = useState(false);
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    setDrag(true);
    e.preventDefault();
    e.stopPropagation();

    const dropdedFile = Array.from(e.dataTransfer.files);
    // const fileList = Array.from(e.target.files); // FileList 객체를 배열로 변환
    const sortedFiles = dropdedFile.sort((a, b) => {
      if (a.name < b.name) {
        return -1; // a가 b보다 앞에 위치해야 함
      }
      if (a.name > b.name) {
        return 1; // b가 a보다 앞에 위치해야 함
      }
      return 0; // 순서 변경 없음
    });
    console.log("sortedFiles :", sortedFiles);

    setFile(sortedFiles);

    const files = [];
    for (let i = 0; i < sortedFiles.length; i++) {
      // console.log("file :", file);
      // console.log("file[0] :", file[0]);
      const fileUrls = URL.createObjectURL(sortedFiles[i]);
      files.push({
        fileName: sortedFiles[i].name,
        fileType: sortedFiles[i].type,
        fileUrls: fileUrls,
      });
    }
    setFiles(files);

    // setDropFile([...dropdedFile]);
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setDropFile([...selectedFiles]);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

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
    console.log("sortedFiles :", sortedFiles);

    setFile(sortedFiles);

    const files = [];
    for (let i = 0; i < sortedFiles.length; i++) {
      // console.log("file :", file);
      // console.log("file[0] :", file[0]);
      const fileUrls = URL.createObjectURL(sortedFiles[i]);
      files.push({
        fileName: sortedFiles[i].name,
        fileType: sortedFiles[i].type,
        fileUrls: fileUrls,
      });
    }
    setFiles(files);
  };

  const downloadZip = async () => {
    const zip = new JSZip();

    // 각 파일을 압축 파일에 추가
    zipFile.forEach((file) => {
      zip.file(
        file.fileName, // zip 파일 이름 설정
        fetch(file.fileUrl) // sortedFiles의 url을 서버에 전송
          .then((res) => res.blob())
        // 결과를 zip하기 위해 blob 파일로 변환 필수
      );
    });

    const content = await zip.generateAsync({ type: "blob" });
    // 압축이 완료 될때까지 비동기 정지

    const downloadLink = URL.createObjectURL(content);

    // 완료된 압축파일 다운로드 링크 생성
    const a = document.createElement("a");
    a.href = downloadLink;
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
    if (changedFiles) {
      console.log("changedFiles :", changedFiles);
      const newChangedFilez = [];
      let autoNums = "";
      for (let i = 0; i < changedFiles.length; i++) {
        if (i < 9) {
          if (changedFiles[i].type === "image/png") {
            autoNums = "_0" + eval(i + 1) + ".png";
          } else if (changedFiles[i].type === "image/jpeg") {
            autoNums = "_0" + eval(i + 1) + ".jpg";
          } else if (changedFiles[i].type === "image/gif") {
            autoNums = "_0" + eval(i + 1) + ".gif";
          }
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
          new File([file[i]], newFileName + autoNums, {
            type: file[i].type,
          })
        );
      }
      setNewChangedFiles(newChangedFilez);
    }
  }, [changedFiles]);

  const FileChanger = () => {
    setChangedFiles(file);
    setDown(true);
  };

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
                      /* border: 1px solid black; */
                      position: relative;
                      box-sizing: border-box;
                      height: 16vw;
                      max-height: 200px;

                      p {
                        position: absolute;
                        top: 0;
                        text-align: center;
                        background-color: black;
                        /* opacity: 0.5; */
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
                    {/* <p>{index}</p> */}
                    {/* <p>{files.fileType}</p>
                    <p>{files.fileUrls}</p> */}
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
                /* height: 16vw; */
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
                  /* height: 26vw; */
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
              <a
                // href="https://www.flaticon.com/kr/free-icons/-"
                title="위쪽 화살표 아이콘"
              >
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
              onClick={(e) => {
                e.preventDefault();
              }}
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
                      /* opacity: 0.5; */
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
