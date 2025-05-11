# OJ上的IDE
在OJ頁面上透過userscript增加編輯器區域，目前只有[ZeroJudge](./UserScript/zerojudgeEditor.js)
## 主要功能
- 在題目頁面提供編輯器
- 提供線上測試範例測資
- 一鍵提交到OJ

## 安裝方法

到瀏覽器插件頁面安裝tampermonkey

![](https://raw.githubusercontent.com/kzzz-jpg/image/main/image/20250511113409429.png)

新增到瀏覽器中後，到你喜歡的OJ網站(項目中有的)，點擊右上角插件圖示，打開tampermonkey頁面

![](https://raw.githubusercontent.com/kzzz-jpg/image/main/image/20250511113800334.png)

選擇新增腳本，把[項目中](./UserScript/)的程式複製到tampermonkey中，按下ctrl+s儲存，重新整理judge頁面後就能看到編輯器

## 各項目細項

### [ZeroJudge](./UserScript/zerojudgeEditor.js)

使用Monaco作為編輯器

![](https://raw.githubusercontent.com/kzzz-jpg/image/main/image/20250511114619901.png)

可選擇語言有CPP/JAVA/PYTHON，透過下拉選單選擇後會自動更改提交時的語言選項，按下提交程式碼按鈕即可提交。

下方有測試測資用區域，目前使用Wandbox API，不過目前只有CPP功能正常，JAVA和PYTHON都會出錯。