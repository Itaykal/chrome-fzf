import './App.css';
import React, { useState } from 'react';
import { Input } from 'antd';


function App() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>()
  return (
      <div className="App">
        <Input.Search onSearch={(props) => {
          chrome.tabs.query({}).then(res => setTabs(res))
        }}></Input.Search>
        {
          tabs?.map(
            (tab) => {
              console.log(tab.title)
              return (
                <text>{tab.url}</text>
              )
            }
          )
        }
      </div>
  );
}

export default App;
