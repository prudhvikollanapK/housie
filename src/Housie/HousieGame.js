import React, { useState, useEffect } from "react";
import {
  FaRedoAlt,
  FaForward,
  FaSync,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { h, o, u, i, s, e, signature } from "../Assests/images/imagePath";
import "./HousieGame.css";
import { FaHeart } from "react-icons/fa";
import { Helmet } from "react-helmet";

const HousieGame = () => {
  const [numbers, setNumbers] = useState(
    Array.from({ length: 90 }, (_, i) => i + 1)
  );
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [lastThree, setLastThree] = useState([]);
  const [totalCollection, setTotalCollection] = useState("");
  const [gladi, setGladi] = useState(0);
  const [lines, setLines] = useState(0);
  const [full, setFull] = useState(0);
  const [isResetConfirmVisible, setIsResetConfirmVisible] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices(); // Triggers loading
    };
  }, []);

  const handleTTS = (text) => {
    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language; // example: "te-IN"
    utterance.volume = 1;
    utterance.pitch = 1.2;
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (voice) =>
          voice.lang === language &&
          (voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("susan") ||
            voice.name.toLowerCase().includes("zira") ||
            voice.name.toLowerCase().includes("google uk english female"))
      ) ||
      voices.find(
        (voice) =>
          voice.lang === "hi-IN" && voice.name.toLowerCase().includes("female")
      ) ||
      voices.find(
        (voice) =>
          voice.lang === "en-IN" && voice.name.toLowerCase().includes("female")
      );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (numbers.length === 0) return;

    const randomIndex = Math.floor(Math.random() * numbers.length);
    const newNumber = numbers[randomIndex];
    setNumbers(numbers.filter((num) => num !== newNumber));
    setSelectedNumbers([...selectedNumbers, newNumber]);
    setLastThree((prev) => [newNumber, ...prev.slice(0, 2)]);

    handleTTS(newNumber.toString());
  };

  const calculateAmounts = (totalAmount) => {
    if (totalAmount <= 0) {
      setFull(0);
      setLines(0);
      setGladi(0);
      return;
    }
    let fullAmount, gladiAmount, lineAmount;
    const randomChoice = Math.floor(Math.random() * 3);
    if (randomChoice === 0) {
      fullAmount = Math.round((totalAmount * 0.4) / 5) * 5;
      gladiAmount = Math.round((totalAmount * 0.3) / 5) * 5;
      lineAmount =
        Math.round((totalAmount - fullAmount - gladiAmount) / 3 / 5) * 5;
    } else if (randomChoice === 1) {
      fullAmount = Math.round((totalAmount * 0.4) / 5) * 5;
      lineAmount = Math.round((totalAmount * 0.35) / 3 / 5) * 5;
      gladiAmount =
        Math.round((totalAmount - fullAmount - lineAmount * 3) / 5) * 5;
    } else {
      lineAmount = Math.round(totalAmount / 5 / 5) * 5;
      fullAmount = lineAmount * 2;
      gladiAmount = lineAmount;
    }
    const distributedTotal = fullAmount + gladiAmount + lineAmount * 3;
    const difference = totalAmount - distributedTotal;
    if (difference !== 0) {
      fullAmount += difference;
    }
    setFull(fullAmount);
    setLines(lineAmount);
    setGladi(gladiAmount);
  };

  const handleTotalCollectionChange = (e) => {
    const amount = parseInt(e.target.value) || 0;
    setTotalCollection(amount);
    calculateAmounts(amount);
  };

  const handleRecalculate = () => {
    calculateAmounts(totalCollection);
  };

  const handleResetConfirm = () => {
    setIsResetConfirmVisible(true);
  };

  const handleConfirmReset = () => {
    setNumbers(Array.from({ length: 90 }, (_, i) => i + 1));
    setSelectedNumbers([]);
    setLastThree([]);
    setTotalCollection("");
    setFull(0);
    setLines(0);
    setGladi(0);
    setIsResetConfirmVisible(false);
  };

  const handleCancelReset = () => {
    setIsResetConfirmVisible(false);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div>
      <Helmet>
        <title>Housie Game | Play & Win!</title>
        <meta
          name="description"
          content="Play the exciting game of Housie with family and friends. Fun, prizes, and unforgettable moments!"
        />
        <meta
          name="keywords"
          content="Housie, bingo, family game, friends, fun"
        />
      </Helmet>

      <div className="housie-game-container flex flex-col items-center p-4 md:p-10">
        <div className="flex items-center space-x-2 mb-8 justify-center w-2">
          {[h, o, u, i, s, e, e].map((imgSrc, idx) => (
            <img key={idx} src={imgSrc} alt={imgSrc} />
          ))}
        </div>

        <div className="content-container flex flex-col lg:flex-row items-center">
          {isResetConfirmVisible && (
            <div className="reset-confirm-modal">
              <div className="modal-content animate-pop">
                <p>Are you sure you want to reset the game?</p>
                <div className="modal-buttons">
                  <button
                    onClick={handleConfirmReset}
                    className="confirm-button"
                  >
                    Yes
                  </button>
                  <button onClick={handleCancelReset} className="cancel-button">
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="number-chart grid grid-cols-10 gap-1 md:gap-2 mb-4 lg:mr-10">
            {Array.from({ length: 90 }, (_, i) => i + 1).map((num) => (
              <div
                key={num}
                className={`number-box ${
                  selectedNumbers.includes(num) ? "selected" : ""
                }`}
              >
                {num}
              </div>
            ))}
          </div>

          <div className="right-section flex flex-col items-center lg:items-center">
            <div className="circle-display mb-4 animate-pop">
              <div className="circle-number">{lastThree[0] || "-"}</div>
            </div>
            <div className="flex space-x-4 mb-2">
              <button
                onClick={handleResetConfirm}
                className="action-button bg-red-600 hover:bg-red-700"
              >
                <FaRedoAlt className="mr-2" /> Reset
              </button>
              <button
                onClick={handleNext}
                className="action-button bg-green-600 hover:bg-green-700"
                disabled={numbers.length === 0}
              >
                <FaForward className="mr-2" /> Next
              </button>
            </div>
            <div className="flex space-x-3 text-2xl mb-4">
              {lastThree.slice(1).map((num, idx) => (
                <div key={idx} className="recent-number animate-bounce">
                  {num}
                </div>
              ))}
            </div>
            <div className="total-collection-section mb-4 w-full items-center lg:items-center">
              <label className="text-white font-semibold mb-2">
                Total Collection:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={totalCollection}
                  onChange={handleTotalCollectionChange}
                  placeholder="Enter amount"
                  className="total-collection-input px-4 py-2 rounded-md w-full text-gray-800"
                />
                <button
                  onClick={handleRecalculate}
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                >
                  <FaSync />
                </button>
              </div>
              <div className="calculation-output font-semibold mt-4 text-white">
                <p>Jaldi: {gladi}</p>
                <p>
                  Lines: {lines * 3} (each {lines})
                </p>
                <p>Full: {full}</p>
              </div>
            </div>

            <div className="df">
              <div className="language-select">
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="bg-gray-700 text-white p-2 rounded-md"
                >
                  <option value="en-US">English</option>
                  <option value="hi-IN">Hindi</option>
                  {/* <option value="te-IN">Telugu</option>
                  <option value="ta-IN">Tamil</option>
                  <option value="ml-IN">Malayalam</option> */}
                </select>
              </div>

              <div className="mute-button p-2">
                <button
                  onClick={handleMuteToggle}
                  className="bg-gray-500 text-white p-2 rounded-md"
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
              </div>
            </div>
          </div>
        </div>
        <p class="pk-credit">
          Made with
          <button
            class="pk-heart"
            aria-label="Love"
            title="Made with love by Prudhvi Kollana"
          >
            ❤
          </button>
          by
          <a
            href="https://prudhvi-kollana-portfolio.vercel.app/"
            target="_blank"
            rel="noopener"
            class="pk-author"
          >
            <img
              src={signature}
              alt="Prudhvi Kollana"
              class="pk-author-img"
            />
          </a>

          <span class="pk-note"><strong>— Housiee</strong></span>
        </p>


      </div>
    </div>
  );
};

export default HousieGame;
