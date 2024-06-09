"use client";
import React, { useEffect, useState } from 'react';
import './App.css'; // Ensure you have this CSS file

function hexToBytes(hex) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return bytes;
}

function hexToString(hex) {
  const bytes = hexToBytes(hex);
  return String.fromCharCode.apply(null, bytes);
}


function App() {
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileContent = async (platform) => {
      try {
        const startTime = Date.now();

        let response, data, fileContent;

        // Define your encoded API URLs
        const apiUrlGithub = hexToString('68747470733A2F2F6170692E6769746875622E636F6D2F7265706F732F53616E736B617272616A2F6D6172732D32322F636F6E74656E74732F524541444D452E6D64');
        // const apiUrlBitbucket = hexToString('68747470733A2F2F6170692E6269746275636B65742E6F72672F322E302F7265706F7369746F726965732F73616E736B61722D6F726967696E616C2F72656163742D61612D61612D30342F7372632F6D61737465722F524541444D452E6D64');
        const apiUrlGitlab = hexToString('68747470733A2F2F6769746C61622E636F6D2F6170692F76342F70726F6A656374732F53616E736B617272616A25324672656163742D61612D61612D30322F7265706F7369746F72792F66696C65732F7061636B6167652E6A736F6E2F7261773F7265663D6D61696E');
        const apiUrlBitbucket = hexToString('68747470733A2F2F6170692E6269746275636B65742E6F72672F322E302F7265706F7369746F726965732F73616E736B61722D6F726967696E616C2F6A736F6E2D61612D746573742F7372632F6D61696E2F524541444D452E6D64')
        if (platform === 'github') {
          response = await fetch(
            apiUrlGithub
          );
        } else if (platform === 'bitbucket') {
          response = await fetch(
            apiUrlBitbucket
          );
        } else if (platform === 'gitlab') {
          response = await fetch(
            apiUrlGitlab
          );
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        if (platform === 'github') {
          data = await response.json();
          if (!data.content) {
            throw new Error('No content found in the response');
          }
          fileContent = atob(data.content.replace(/\n/g, '')); // Decode base64 content
        } else if (platform === 'bitbucket' || platform === 'gitlab') {
          fileContent = await response.text(); // Fetch as plain text
        }

        const endTime = Date.now();
        const elapsedTime = endTime - startTime;

        console.log(`${platform} response time: ${elapsedTime}ms`);

        setFileContent(fileContent);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching and decoding file:', error.message);
        setError('Failed to fetch and decode file');
        setLoading(false);
      }
    };

    // Fetch file content from GitHub, Bitbucket, and GitLab in parallel
    Promise.race([
      // fetchFileContent('github'),
      fetchFileContent('bitbucket'),
      // fetchFileContent('gitlab')
    ]);

  }, []);

  if (loading) {
    return (
      <div className="shockwave-container">
        <div className="shockwave"></div>
        <div>loading...</div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>File Content</h1>
        <div className="content-container">
          <pre className="wrapped-content">{fileContent}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;
