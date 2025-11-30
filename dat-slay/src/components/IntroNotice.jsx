import React from "react";

function IntroNotice({ title, text }) {
    return (
        <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800 mr-2">{title}</span>
            <span className="text-gray-600">{text}</span>
        </p>
    );
}

export default IntroNotice;
