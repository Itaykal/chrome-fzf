import "./App.css";
import React, { useState } from "react";
import { useAsync } from "react-async";
import { Fzf, FzfResultItem } from "fzf";
import { Avatar, Input, List, Typography } from "antd";

interface Tab extends chrome.tabs.Tab {}

async function fetchTabs(): Promise<Tab[]> {
  return await chrome.tabs.query({})
}

const HighlightChars = (props: { str: string; indices: Set<number> }) => {
  const chars: string[] = props.str.split("");

  const nodes = chars.map((char, i) => {
    if (props.indices.has(i)) {
      return <Typography.Text mark={true}>{char}</Typography.Text>;
    } else {
      return char;
    }
  });
  return <>{nodes}</>;
};


function App() {  
  const [loadingState, setLoadingState] = useState<Boolean>(false);
  const [cursor, setCursor] = useState<number>(0);
  const [foundTabs, setFoundTabs] = useState<FzfResultItem<Tab>[]>();
  const {data , error} = useAsync({promiseFn: fetchTabs});
  
  if (error) return (<div>{error.message}</div>);

  const fzf = new Fzf(
    data ? data : [],
    {selector: (item) => item.title ? item.title : item.url ? item.url : "OOF"}
  )

  return (
    <div className="App">
      <Input.Search
        loading={loadingState ? false : loadingState}
        onChange={(e) => {
          const value = e.target.value
          setLoadingState(true);
          setFoundTabs([])
          const results = fzf.find(value)
          setFoundTabs(results)
          setLoadingState(false);
        }}
      ></Input.Search>
      <List loading={loadingState ? false : loadingState}>
        {foundTabs?.map((tab) => {
          if (tab.item.id && tab.item.title) {
            const tabId = tab.item.id
            return (
              <List.Item id={tabId.toLocaleString()} onClick={() => {chrome.tabs.update(tabId, {active: true})}}>
                <List.Item.Meta
                  title={<HighlightChars str={tab.item.title.normalize()} indices={tab.positions}></HighlightChars>}
                  avatar={<Avatar src={tab.item.favIconUrl}></Avatar>}
                  description={
                    <Typography.Text>
                      {tab.item.url}
                    </Typography.Text>
                  }
                ></List.Item.Meta>
              </List.Item>
            );
          }
        })}
      </List>
    </div>
  );
}

export default App;
