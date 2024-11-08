import React, { useState } from 'react';
import { FaRedoAlt, FaForward, FaSync } from 'react-icons/fa';
import { h, o, u, i, s, e, signature } from '../Assests/images/imagePath';
import './HousieGame.css';

const HousieGame = () => {
  const [numbers, setNumbers] = useState(Array.from({ length: 90 }, (_, i) => i + 1));
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [lastThree, setLastThree] = useState([]);
  const [totalCollection, setTotalCollection] = useState('');
  const [gladi, setGladi] = useState(0);
  const [lines, setLines] = useState(0);
  const [full, setFull] = useState(0);
  const [isResetConfirmVisible, setIsResetConfirmVisible] = useState(false);


  const handleNext = () => {
    if (numbers.length === 0) return;

    const randomIndex = Math.floor(Math.random() * numbers.length);
    const newNumber = numbers[randomIndex];
    setNumbers(numbers.filter(num => num !== newNumber));
    setSelectedNumbers([...selectedNumbers, newNumber]);

    setLastThree(prev => [newNumber, ...prev.slice(0, 2)]);
  };


  const calculateAmounts = (totalAmount) => {
    if (totalAmount <= 0) {
      setFull(0);
      setLines(0);
      setGladi(0);
      return;
    }
    // Amount distribution logic
    let fullAmount, gladiAmount, lineAmount;
    const randomChoice = Math.floor(Math.random() * 3);
    if (randomChoice === 0) {
      fullAmount = Math.round(totalAmount * 0.4 / 5) * 5;
      gladiAmount = Math.round(totalAmount * 0.3 / 5) * 5;
      lineAmount = Math.round((totalAmount - fullAmount - gladiAmount) / 3 / 5) * 5;
    } else if (randomChoice === 1) {
      fullAmount = Math.round(totalAmount * 0.4 / 5) * 5;
      lineAmount = Math.round((totalAmount * 0.35) / 3 / 5) * 5;
      gladiAmount = Math.round((totalAmount - fullAmount - lineAmount * 3) / 5) * 5;
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
    setIsResetConfirmVisible(true); // Show confirmation modal
  };
  
  const handleConfirmReset = () => {
    // Actual reset logic
    setNumbers(Array.from({ length: 90 }, (_, i) => i + 1));
    setSelectedNumbers([]);
    setLastThree([]);
    setTotalCollection('')
    setFull(0);
    setLines(0);
    setGladi(0);
    setIsResetConfirmVisible(false); // Hide confirmation modal
  };
  
  const handleCancelReset = () => {
    setIsResetConfirmVisible(false); // Hide confirmation modal without resetting
  };
  

  return (
    <div className='housie-game-container flex flex-col items-center p-4 md:p-10 lg:p-20'>
      {/* Title with Icon */}
      <div className="flex items-center space-x-2 mb-8 justify-center w-2">
        {[h, o, u, i, s, e].map((imgSrc, idx) => (
          <img key={idx} src={imgSrc} alt={imgSrc} />
        ))}
      </div>

      <div className="content-container flex flex-col lg:flex-row items-center">

            {/* Reset Confirmation Modal */}
    {isResetConfirmVisible && (
      <div className="reset-confirm-modal">
        <div className="modal-content animate-pop">
          <p>Are you sure you want to reset the game?</p>
          <div className="modal-buttons">
            <button onClick={handleConfirmReset} className="confirm-button">Yes</button>
            <button onClick={handleCancelReset} className="cancel-button">No</button>
          </div>
        </div>
      </div>
    )}


        {/* Number Chart */}
        <div className="number-chart grid grid-cols-10 gap-1 md:gap-2 mb-4 lg:mr-10">
          {Array.from({ length: 90 }, (_, i) => i + 1).map(num => (
            <div key={num} className={`number-box ${selectedNumbers.includes(num) ? 'selected' : ''}`}>
              {num}
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="right-section flex flex-col items-center lg:items-center">
          <div className="circle-display mb-4 animate-pop">
            <div className="circle-number">{lastThree[0] || '-'}</div>
          </div>
          <div className="flex space-x-4 mb-2">
          <button onClick={handleResetConfirm} className="action-button bg-red-600 hover:bg-red-700">
  <FaRedoAlt className="mr-2" /> Reset
</button>
            <button onClick={handleNext} className="action-button bg-green-600 hover:bg-green-700" disabled={numbers.length === 0}>
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
            <label className="text-white font-semibold mb-2">Total Collection:</label>
            <div className="flex items-center space-x-2">
              <input type="number" value={totalCollection} onChange={handleTotalCollectionChange} placeholder="Enter amount" className="total-collection-input px-4 py-2 rounded-md w-full text-gray-800" />
              <button onClick={handleRecalculate} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                <FaSync />
              </button>
            </div>
            <div className="calculation-output font-semibold mt-4 text-white">
              <p>Gladi: {gladi}</p>
              <p>Lines: {lines * 3} (each {lines})</p>
              <p>Full: {full}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="absolute bottom-4 text-center w-full text-sm text-black opacity-70">
  <span>--- Love, </span>
  <img src={signature} alt="Signature" className="inline-block align-middle mx-2" />
  <span> ---</span>
</div>

    </div>
  );
};

export default HousieGame;
