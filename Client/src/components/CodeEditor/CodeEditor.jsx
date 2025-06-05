import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import HomeButton from '../Home/HomeButton';
import './CodeEditor.css';

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com';
const RAPID_API_KEY = '085e2169e5mshe2386c019e7beafp1c4aa8jsn5a25eb7e7bdb';
const RAPID_API_HOST = 'judge0-ce.p.rapidapi.com';

const languageOptions = [
    { id: 54, name: 'C++', extension: 'cpp', defaultCode: '#include <iostream>\n\nusing namespace std;\n\nint main() {\n    cout << "Hello World!";\n    return 0;\n}' },
    { id: 62, name: 'Java', extension: 'java', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}' },
    { id: 71, name: 'Python', extension: 'py', defaultCode: 'print("Hello World!")' },
    { id: 63, name: 'JavaScript', extension: 'js', defaultCode: 'console.log("Hello World!");' }
];

const CodeEditor = () => {
    const [code, setCode] = useState(languageOptions[0].defaultCode);
    const [language, setLanguage] = useState(languageOptions[0]);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [status, setStatus] = useState('');
    const [isCompiling, setIsCompiling] = useState(false);

    const handleLanguageChange = (e) => {
        const selectedLang = languageOptions.find(lang => lang.id === parseInt(e.target.value));
        setLanguage(selectedLang);
        setCode(selectedLang.defaultCode);
    };

    const handleCodeChange = (value) => {
        setCode(value);
    };

    const handleSubmit = async () => {
        setIsCompiling(true);
        setStatus('Compiling...');
        setOutput('');

        const options = {
            method: 'POST',
            url: `${JUDGE0_API}/submissions`,
            params: {
                base64_encoded: 'false',
                fields: '*'
            },
            headers: {
                'content-type': 'application/json',
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': RAPID_API_KEY,
                'X-RapidAPI-Host': RAPID_API_HOST
            },
            data: {
                language_id: language.id,
                source_code: code,
                stdin: input
            }
        };

        try {
            // Create submission
            const submitResponse = await axios.request(options);
            
            if (!submitResponse.data.token) {
                throw new Error('No token received from submission');
            }

            const token = submitResponse.data.token;

            // Poll for results
            let attempts = 0;
            const maxAttempts = 10;
            const pollInterval = 1000; // 1 second

            const pollResult = async () => {
                if (attempts >= maxAttempts) {
                    setStatus('Error: Compilation timeout');
                    setIsCompiling(false);
                    return;
                }

                try {
                    const resultResponse = await axios.get(`${JUDGE0_API}/submissions/${token}`, {
                        headers: {
                            'X-RapidAPI-Key': RAPID_API_KEY,
                            'X-RapidAPI-Host': RAPID_API_HOST
                        },
                        params: {
                            base64_encoded: 'false',
                            fields: '*'
                        }
                    });

                    const { status, stdout, stderr, compile_output } = resultResponse.data;

                    if (status?.id <= 2) { // In Queue or Processing
                        attempts++;
                        setTimeout(pollResult, pollInterval);
                    } else {
                        setIsCompiling(false);
                        if (status?.id === 3) { // Accepted
                            setStatus('Success');
                            setOutput(stdout || compile_output || 'Program completed successfully');
                        } else if (status?.id === 6) { // Compilation Error
                            setStatus('Compilation Error');
                            setOutput(compile_output || stderr || 'Compilation failed');
                        } else if (status?.id === 5) { // Time Limit Exceeded
                            setStatus('Time Limit Exceeded');
                            setOutput('Your program took too long to execute');
                        } else {
                            setStatus(`Error: ${status?.description || 'Unknown error'}`);
                            setOutput(stderr || compile_output || 'An error occurred during execution');
                        }
                    }
                } catch (error) {
                    console.error('Error polling result:', error);
                    setStatus('Error checking submission status');
                    setIsCompiling(false);
                }
            };

            await pollResult();
        } catch (error) {
            console.error('Error submitting code:', error);
            setStatus('Error submitting code');
            setIsCompiling(false);
        }
    };

    return (
        <>
            <HomeButton />
            <div className="code-editor-container">
                <div className="editor-header">
                    <select 
                        value={language.id} 
                        onChange={handleLanguageChange}
                        className="language-select"
                    >
                        {languageOptions.map(lang => (
                            <option key={lang.id} value={lang.id}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                    <button 
                        onClick={handleSubmit} 
                        disabled={isCompiling}
                        className="run-button"
                    >
                        {isCompiling ? 'Running...' : 'Run Code'}
                    </button>
                </div>

                <div className="editor-main">
                    <div className="editor-wrapper">
                        <Editor
                            height="70vh"
                            defaultLanguage={language.extension}
                            language={language.extension}
                            value={code}
                            onChange={handleCodeChange}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                tabSize: 4,
                            }}
                        />
                    </div>

                    <div className="io-panel">
                        <div className="input-section">
                            <h3>Input</h3>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter input here..."
                            />
                        </div>
                        <div className="output-section">
                            <h3>Output</h3>
                            <div className="output-content">
                                {status && <div className={`status ${status.toLowerCase().includes('error') ? 'error' : 'success'}`}>
                                    {status}
                                </div>}
                                <pre>{output}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CodeEditor; 