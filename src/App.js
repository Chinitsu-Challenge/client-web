import './App.css'
import { useState, useEffect } from 'react'

class STAGE {
  static P2_0 = 0 // 己方刚出牌，对方正在判断是否荣和
  static P2_1 = 1 // 对方刚摸牌
  static P1_0 = 2 // 对方刚出牌，己方正在判断是否荣和
  static P1_1 = 3 // 己方刚摸牌
}

function App() {
  const [scoreP1, setScoreP1] = useState(114514)
  const [scoreP2, setScoreP2] = useState(114514)
  const [discardsP1, setDiscardsP1] = useState(["1s", "2s", "3s", "1s!", "2s", "3s", "1s", "2s", "3s"])
  const [discardsP2, setDiscardsP2] = useState([])
  const [handsP1, setHandsP1] = useState(["4s", "5s"])
  const [anKanP1, setAnKanP1] = useState(["1s", "2s"]) // 暗杠
  const [anKanP2, setAnKanP2] = useState(["1s", "2s"])
  const [drawnTileP1, setDrawnTileP1] = useState("6s")
  const [drawnTileP2, setDrawnTileP2] = useState(true)
  const [countDown, setCountDown] = useState(666)
  const [stage, setStage] = useState(STAGE.P1_1)
  const [riichiP1, setRiichiP1] = useState(true)
  const [riichiP2, setRiichiP2] = useState(false)

  const numHandsP2 = 13 - anKanP2.length * 4
  const numRemainingTiles = 36 - numHandsP2 - handsP1.length - discardsP1.length - discardsP2.length -
    (anKanP1.length + anKanP2.length) * 4 - (drawnTileP1 ? 1 : 0) - (drawnTileP2 ? 1 : 0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(c => c - 1)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const onHandClick = (idx) => {
    switch (stage) {
      case STAGE.P1_1:
        const newHandsP1 = [...handsP1]
        setDiscardsP1([...discardsP1, handsP1[idx]])
        newHandsP1.splice(idx, 1)
        newHandsP1.push(drawnTileP1)
        setHandsP1(newHandsP1)
        setDrawnTileP1(null)
        setStage(STAGE.P2_0)
        break
    }
  }

  const onDrawnTileClick = () => {
    switch (stage) {
      case STAGE.P1_1:
        setDiscardsP1([...discardsP1, drawnTileP1])
        setDrawnTileP1(null)
        setStage(STAGE.P2_0)
        break
    }
  }

  return (
    <>
      <div className="flex fixed bg-blue-400 w-screen top-0"> {/* 对手手牌 */}
        <div className="flex flex-none items-start">
          {anKanP2.map(i => <div className="flex">
            <img className="w-12" src="./back_2.png" />
            <img className="w-12" src={`./${i}_2.png`} />
            <img className="w-12" src={`./${i}_2.png`} />
            <img className="w-12" src="./back_2.png" />
          </div>)}
        </div>
        <div className="flex flex-1 justify-center items-start">
          {drawnTileP2 &&
            <div className="me-8">
              <img className="w-12" src="./back_2.png" />
            </div>}
          <div className="flex items-start">
            {Array(numHandsP2).fill().map(i => <img className="w-12" src="back_2.png" />)}
          </div>
        </div>
      </div> {/* 对手手牌 */}
      <div className="flex flex-col h-screen items-center">
        <div className="flex flex-1 pe-4 w-80 items-end justify-end bg-orange-200"> {/* 对手牌河 */}
          <div className="flex flex-row-reverse flex-wrap-reverse items-start">
            {discardsP2.map((e, i) => {
              const j = Math.floor(i / 6)
              return e.endsWith("!") ?
                <img className="w-16 relative" style={{ zIndex: 1000 - j, top: `${j * 16}px` }} src={`./${e.slice(0, -1)}_3.png`} /> :
                <img className="w-12 relative" style={{ zIndex: 1000 - j, top: `${j * 16}px` }} src={`./${e}_2.png`} />
            })}
          </div>
        </div> {/* 对手牌河 */}
        <div className="flex-none flex flex-col justify-between items-center w-48 h-48 bg-black">
          <div className="flex items-center m-2 w-24 h-10 bg-gray-600 text-orange-600 rotate-180 justify-center">{scoreP2}</div>
          <div className={`flex w-24 h-3 bg-white items-center justify-center ${riichiP2 ? "" : "invisible"}`}>
            <div className="w-2 h-2 rounded-full bg-red-600"></div>
          </div>
          <div className="flex items-center m-2 w-24 h-10 bg-gray-600 text-orange-600 justify-center">余 {numRemainingTiles}</div>
          <div className={`flex w-24 h-3 bg-white items-center justify-center ${riichiP1 ? "" : "invisible"}`}>
            <div className="w-2 h-2 rounded-full bg-red-600"></div>
          </div>
          <div className="flex items-center m-2 w-24 h-10 bg-gray-600 text-orange-600 justify-center">{scoreP1}</div>
        </div>
        <div className="flex flex-1 ps-4 w-80 items-start bg-orange-200"> {/* 自己的牌河 */}
          <div className="flex flex-wrap items-start">
            {discardsP1.map((e, i, arr) => {
              const checking = i == arr.length - 1 && stage == STAGE.P2_0
              const j = Math.floor(i / 6)
              const style = {
                zIndex: j,
                bottom: `${j * 16 - (checking ? 8 : 0)}px`,
                left: `${checking ? 8 : 0}px`
              }
              return e.endsWith("!") ?
                <img className="w-16 relative" style={style} src={`./${e.slice(0, -1)}_1.png`} /> :
                <img className="w-12 relative" style={style} src={`./${e}_0.png`} />
            })}
          </div>
        </div> {/* 自己的牌河 */}
      </div>
      <div className="flex fixed bg-blue-400 w-screen bottom-0"> {/* 自己的手牌 */}
        <div className="flex flex-1 justify-center items-end">
          <div className="flex items-end">
            {handsP1.map((e, i) => <img className="w-12 hover:mb-5" src={`./${e}_0.png`} onClick={() => onHandClick(i)} />)}
          </div>
          {drawnTileP1 &&
            <div className="ms-8">
              <img className="w-12 hover:mb-5" src={`./${drawnTileP1}_0.png`} onClick={onDrawnTileClick} />
            </div>}
        </div>
        <div className="flex flex-none items-end flex-row-reverse">
          {anKanP1.map(i => <div className="flex">
            <img className="w-12" src="./back_0.png" />
            <img className="w-12" src={`./${i}_0.png`} />
            <img className="w-12" src={`./${i}_0.png`} />
            <img className="w-12" src="./back_0.png" />
          </div>)}
        </div>
      </div> {/* 自己的手牌 */}
      <div className="flex fixed bottom-36 right-12 h-24 w-96 bg-green-400 justify-start items-center">
        <button className="bg-gray-300">和牌</button>
        {countDown > 0 && <div>{countDown}</div>}
      </div>
    </>
  )
}

export default App
