import "./App.css";
import React, { useState } from "react";
import { Fzf } from 'fzf';
import { Avatar, Input, List, Typography } from "antd";

function App() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>();

  const [loadingState, setLoadingState] = useState<Boolean>(false);
  const [cursor, setCursor] = useState<number>(0);

  return (
    <div className="App">
      <Input.Search
        loading={loadingState ? false : loadingState}
        onSearch={(props) => {
          setLoadingState(true);
          chrome.tabs.query({}).then((res) => setTabs(res));

          setLoadingState(false);
        }}
      ></Input.Search>
      <List loading={loadingState ? false : loadingState}>
        {tabs?.map((tab) => {
          if (tab.id) {
            return (
              <List.Item id={tab.id.toLocaleString()}>
                <List.Item.Meta title={tab.title} avatar={<Avatar src={tab.favIconUrl}></Avatar>} description={<Typography.Text style={{ overflow: "hidden"}}>{tab.url}</Typography.Text>}></List.Item.Meta>
              </List.Item>
            );
          }
        })}
      </List>
    </div>
  );
}

export default App;
