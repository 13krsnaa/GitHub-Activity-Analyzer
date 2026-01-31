import React from 'react';

function LanguageList({ sortedLanguages, totalReposWithLang }) {
    if (sortedLanguages.length === 0) {
        return <p className="text-dim">No language data available</p>;
    }

    return (
        <>
            {sortedLanguages.map(([lang, count]) => {
                const percentage = ((count / totalReposWithLang) * 100).toFixed(1);
                return (
                    <div key={lang} className="language-item">
                        <span className="lang-name">{lang}</span>
                        <span className="lang-percentage">{count} repos ({percentage}%)</span>
                    </div>
                );
            })}
        </>
    );
}

export default LanguageList;
