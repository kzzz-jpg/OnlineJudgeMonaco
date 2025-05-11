// ==UserScript==
// @name         OJ Monaco Editor
// @namespace    http://your-namespace/
// @version      1.0
// @description  在題目頁面底部嵌入Monaco編輯器
// @author       You
// @match        https://zerojudge.tw/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/turndown/7.2.0/turndown.min.js#sha512-sJzEecN5Nk8cq81zKtGq6/z9Z/r3q38zV9enY75IVxiG7ybtlNUt864sL4L1Kf36bYIwxTMVKQOtU4VhD7hGrw==
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/markdown-it/13.0.2/markdown-it.js#sha512-2LtYcLGnCbAWz9nDIrfG2pHFiFu9n+3oGecQlzLuYsLgen/oxiYscGWnDST9J9EZanlsQkDD0ZP2n/6peDuALQ==
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/chroma-js/2.4.2/chroma.min.js#sha512-zInFF17qBFVvvvFpIfeBzo7Tj7+rQxLeTJDmbxjBz5/zIr89YVbTNelNhdTT+/DCrxoVzBeUPVFJsczKbB7sew==
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/xterm/5.5.0/xterm.js#sha512-Gujw5GajF5is3nMoGv9X+tCMqePLL/60qvAv1LofUZTV9jK8ENbM9L+maGmOsNzuZaiuyc/fpph1KT9uR5w3CQ==
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/dexie/4.0.7/dexie.min.js#sha512-882VotT07mOQRzqIxsyxHzJX0XUaoeee3qXp4THg1A0KI0XFnWFAaLFQm0x6OW3pHSIipVZW+gzQ1w9b6uvkVw==
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/i18next/23.11.5/i18next.min.js#sha512-3RSGkmT48HnO+hlmzGYDx5/w2LIBX0O5hSuYX6KWAxmvVlSjFgoxIaWa2tlMExheGvt3lLyxeTsXfpC47yb8CQ==
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/i18next-http-backend/2.5.2/i18nextHttpBackend.min.js#sha512-bBb+wrGRTx4MvHpksYb1Iv5oJ1o8ineCqpc0cnTgdJQhuAFJJ93SEVXxUOCptvt0vAqYdjzWO5emorYUBt6Ceg==
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/jquery-i18next/1.2.1/jquery-i18next.min.js#sha512-79RgNpOyaf8AvNEUdanuk1x6g53UPoB6Fh2uogMkOMGADBG6B0DCzxc+dDktXkVPg2rlxGvPeAFKoZxTycVooQ==
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/highlight.js/11.9.0/highlight.min.js#sha512-D9gUyxqja7hBtkWpPWGt9wfbfaMGVt9gnyCvYa+jojwwPHLCzUm5i8rpk7vD7wNee9bA35eYIjobYPaQuKS1MQ==
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/dialog-polyfill/0.5.6/dialog-polyfill.min.js#sha512-qUIG93zKzcLBVD5RGRbx2PBmbVRu+tJIl+EPLTus0z8I1AMru9sQYdlf6cBacSzYmZVncB9rcc8rYBnazqgrxA==
// @resource     acwing_cpp_code_completer https://aowuucdn.oss-accelerate.aliyuncs.com/acwing_cpp_code_completer-0.0.11.json#sha512-DQVpao4qMMExToRdid0g/S0nbO/C9hwCECjI5aW8A0g7nvi8hEcD2Lw3QIqdJBV7haP15oJOocfwuiw7ryTO9w==
// ==/UserScript==

(function() {
    'use strict';

    // 檢測是否在題目頁面
    if (!window.location.href.includes('ShowProblem')) return;

    // 防止重複注入
    if (document.getElementById('OJBetter_editor')) return;
    const requireScript = document.createElement('script');
    requireScript.src = 'https://cdn.bootcdn.net/ajax/libs/require.js/2.3.7/require.min.js';

    // 添加編輯器容器
    const editorContainer = document.createElement('div');
    editorContainer.id = 'OJBetter_editor';
    editorContainer.style.height = '500px';
    editorContainer.style.borderTop = '1px solid #ddd';

    //尋找正確位置
    const targetDiv = document.querySelector('table.table-hover').parentElement.parentElement;
    targetDiv.parentNode.insertBefore(editorContainer, targetDiv);

    //創建選擇語言選單
    const langSelectorWrapper = document.createElement('div');
    langSelectorWrapper.id = 'OJBetter_langSelectorWrapper';
    const langLabel = document.createElement('label');
    langLabel.id = 'OJBetter_langLabel';
    langLabel.textContent = '語言：';
    langLabel.setAttribute('for', 'OJBetter_langSelector');
    const langSelector = document.createElement('select');
    langSelector.id = 'OJBetter_langSelector';
    ['cpp', 'python', 'java'].forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang.toUpperCase();
        langSelector.appendChild(option);
    });
    langSelectorWrapper.appendChild(langLabel);
    langSelectorWrapper.appendChild(langSelector);
    targetDiv.parentNode.insertBefore(langSelectorWrapper, editorContainer);

    //創建提交按鈕
    const submitBtn = document.createElement('button');
    submitBtn.textContent = '提交程式碼';
    submitBtn.style.marginLeft = '20px';
    submitBtn.style.padding = '5px 15px';
    submitBtn.style.borderRadius = '6px';
    submitBtn.style.border = 'none';
    submitBtn.style.backgroundColor = '#2d8cf0';
    submitBtn.style.color = 'white';
    submitBtn.style.cursor = 'pointer';
    langSelectorWrapper.appendChild(submitBtn);

    // 創建測試區域(尚未啟用)
    const testAreaWrapper = document.createElement('div');
    testAreaWrapper.id = 'OJBetter_testAreaWrapper';
    const testInput = document.createElement('textarea');
    testInput.id = 'OJBetter_testInput';
    testInput.placeholder = '輸入測試案例，使用換行分隔(這邊目前裝飾用 功能還不正常)';
    testInput.style.width = '100%';
    testInput.style.height = '150px';
    //testInput.style.display = 'none'; //尚未啟用
    testAreaWrapper.appendChild(testInput);
    const runBtn = document.createElement('button');
    runBtn.textContent = '運行測試案例(這邊目前裝飾用 功能還不正常)';
    runBtn.style.marginTop = '10px';
    runBtn.style.padding = '5px 15px';
    runBtn.style.borderRadius = '6px';
    runBtn.style.border = 'none';
    runBtn.style.backgroundColor = '#28a745';
    runBtn.style.color = 'white';
    runBtn.style.cursor = 'pointer';
    //runBtn.style.display = 'none'; //尚未啟用
    testAreaWrapper.appendChild(runBtn);
    editorContainer.parentNode.insertBefore(testAreaWrapper, editorContainer.nextSibling);
    const expectedOutput = document.createElement('textarea');
    expectedOutput.id = 'OJBetter_expectedOutput';
    expectedOutput.placeholder = '輸入預期輸出，每行對應一組測資輸出';
    expectedOutput.style.width = '100%';
    expectedOutput.style.height = '100px';
    expectedOutput.style.marginTop = '10px';
    testAreaWrapper.appendChild(expectedOutput);

    const actualOutput = document.createElement('textarea');
    actualOutput.id = 'OJBetter_actualOutput';
    actualOutput.placeholder = '實際輸出結果會顯示在這裡';
    actualOutput.readOnly = true;
    actualOutput.style.width = '100%';
    actualOutput.style.height = '100px';
    actualOutput.style.marginTop = '10px';
    testAreaWrapper.appendChild(actualOutput);

    const compareResult = document.createElement('div');
    compareResult.id = 'OJBetter_compareResult';
    compareResult.style.marginTop = '10px';
    compareResult.style.fontWeight = 'bold';
    testAreaWrapper.appendChild(compareResult);



    // 添加自定義樣式
    GM_addStyle(`
        #OJBetter_editor {
            position: relative;
            margin: 30px auto;
            max-width: 1200px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .monaco-menu {
            z-index: 10000 !important;
        }
        #OJBetter_langSelectorWrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px auto 0;
            gap: 10px;
            font-family: sans-serif;
        }

        #OJBetter_langLabel {
            font-size: 16px;
            color: #444;
        }

        #OJBetter_langSelector {
            font-size: 16px;
            padding: 5px 10px;
            border-radius: 6px;
            border: 1px solid #ccc;
            background-color: #f9f9f9;
            cursor: pointer;
            transition: all 0.2s;
        }

        #OJBetter_langSelector:hover {
            background-color: #eaeaea;
        }
        #OJBetter_testAreaWrapper {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        #OJBetter_testInput {
            font-size: 16px;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            background-color: #f9f9f9;
        }
        #OJBetter_expectedOutput, #OJBetter_actualOutput {
            font-size: 16px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            background-color: #f9f9f9;
        }

   `);

    // 初始化Monaco
    requireScript.onload = () => {
        initMonaco();
    }

    // 在初始化 Monaco 編輯器後，根據語言設置表單
    function updateFormLanguage(language) {
        const radioButtons = document.querySelectorAll('input[name="language"]');
        radioButtons.forEach((radio) => {
            if (radio.value.toLowerCase() === language) {
                radio.checked = true;  // 選擇相應的語言
            }
        });
    }

    async function initMonaco() {
        // 配置Monaco路徑
        require.config({ paths: { vs: 'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/monaco-editor/0.49.0/min/vs' }});

        // 異步加載核心
        const monaco = await new Promise((resolve) => {
            require(['vs/editor/editor.main'], resolve);
        });

        // 預設語言設置（假設從語言選單中選擇的值）
        const selectedLanguage = 'cpp';

        // 創建編輯器實例
        let editor = monaco.editor.create(editorContainer, {
            value: GM_getValue('savedCode', '// Start coding here\n'),
            language: 'cpp',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: true },
            fontSize: 18,
            scrollBeyondLastLine: false
        });

        // 更新語言選擇表單中的選項
        updateFormLanguage(selectedLanguage);

        // 代碼保存機制
        editor.onDidChangeModelContent(() => {
            GM_setValue('savedCode', editor.getValue());
        });

        //選單改變 改變編輯器語言
        langSelector.addEventListener('change', () => {
            const newLang = langSelector.value;
            updateFormLanguage(newLang);
            monaco.editor.setModelLanguage(editor.getModel(), newLang);
        });

        //提交編輯器中的程式
        submitBtn.onclick = () => {

            // 找到表單中的 <textarea name="code">
            const codeTextarea = document.querySelector('textarea[name="code"]');
            if (!codeTextarea) {
                alert('找不到程式碼輸入欄位，無法提交');
                return;
            }

            // 將 Monaco 的程式碼設回 <textarea>（這樣 jQuery.serialize() 才能抓到正確值）
            codeTextarea.value = editor.getValue();

            // 觸發原本的提交按鈕
            const realSubmitBtn = document.querySelector('button#submitCode');
            if (realSubmitBtn) {
                realSubmitBtn.click();
            } else {
                alert('找不到原始提交按鈕');
            }
        };

        //測試執行按鈕被按下(尚未啟用)
        runBtn.onclick = async function() {
            const code = editor.getValue();
            const testCases = testInput.value.split('\n');
            const language = langSelector.value;

            const data = {
                code: code,
                test_cases: testCases,
                language: language
            };
            compareResult.textContent='正在運行中';
            const result = await runWandbox(data);
            //alert('測試結果：' + result);
            actualOutput.value=result;
            try{
                //console.log(expectedOutput.value,result,expectedOutput.value==result);
                if(expectedOutput.value.replace(/[ \t]+$/gm, '').replace(/\n+$/, '')==result.replace(/[ \t]+$/gm, '').replace(/\n+$/, '')){
                    compareResult.textContent='AC';
                }else{
                    compareResult.textContent='WA';
                }
            }catch(e){
                compareResult.textContent='出錯了qwq '+e;
            }
        };

        // 调用Wandbox API运行代码(尚未啟用)
        async function runWandbox(data) {
            const compilerMap = {
                cpp: 'gcc-head',
                python: 'cpython-3.10.0',
                java: 'openjdk-head'
            };

            const payload = {
                code: data.code,
                compiler: compilerMap[data.language],
                stdin: data.test_cases.join('\n'),
                save: false
            };

            const response = await fetch('https://wandbox.org/api/compile.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            try{
                const result = await response.json();

                if (result.status === '0') {
                    return result.program_output || '(沒有輸出)';
                } else {
                    return result.compiler_message || result.program_error || '未知錯誤';
                }
            }catch(e){
                return e;
            }
        }
    }
    document.body.appendChild(requireScript);
})();