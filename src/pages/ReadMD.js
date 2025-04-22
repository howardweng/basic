import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ReadMD = () => {
    const [markdownContent, setMarkdownContent] = useState('');
    const [currentFile, setCurrentFile] = useState('/color.md'); // Default file

    const buttons = [
        { label: 'Color Spec', file: '/color.md' },
        { label: 'About', file: '/about.md' },
    ];

    useEffect(() => {
        fetch(currentFile)
            .then(response => response.text())
            .then(text => {
                setMarkdownContent(text);
            });
    }, [currentFile]); // Re-fetch when currentFile changes

    const handleFileChange = (file) => {
        setCurrentFile(file);
    };

    return (
        <div className="mx-5">
            <div className="mb-4">
                {buttons.map((button, index) => (
                    <button
                        key={index}
                        onClick={() => handleFileChange(button.file)}
                        className="mr-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                    >
                        {button.label}
                    </button>
                ))}
            </div>
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
    );
};

export default ReadMD; 