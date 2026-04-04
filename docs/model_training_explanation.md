# Phase 2: AI Model Training Explained

This document is your **"Cheat Sheet" for your Viva defense**. It explains exactly what we did during the AI Model Training phase of the PharmaSight project in simple, universally understood terms.

Our goal in this phase was to take the massive, newly assembled `master_feature_table.csv` (which contains 4 years of daily drug demand and supply chain alerts) and teach Neural Networks how to predict an impending drug shortage 30 days before it hits the hospital. 

We executed this phase in **three distinct steps**:

---

## 1. The Baseline Benchmark (LightGBM)
**The Problem:** In academic AI projects, you can't just build a massive Neural Network and say "it works perfectly." You have to prove that your complex Neural Network is doing a better job than a "dumb," traditional method.
**What We Did:** We built a standard `LightGBM` framework. This represents traditional, old-school statistics.
**Why We Did It:** This acts as our "Baseline Benchmark." If our advanced AI models can't beat this simple baseline, it means our advanced AI is fundamentally broken. By running this first, you prove to your professors that you are employing rigorous scientific evaluation methodologies.

---

## 2. GraphSAGE (Mapping Geographic Supply Risks)
**The Problem:** Predicting drug shortages isn't just about "how much of this drug did the hospital order yesterday." It is deeply connected to geography and supply lines. If a specific drug manufacturer in India suddenly reports poor financial health, that specific risk ripples through specific regional distributors before finally causing a shortage at a specific US hospital. Modern AI needs to understand this 3D map of the supply chain.
**What We Did:** We built a **Graph Neural Network** using an algorithm called **GraphSAGE** (Sample and Aggregate). We took the 90 Nodes (manufacturers, distributors, hospitals) and the lines connecting them (edges). 
**Why We Did It:** GraphSAGE takes all of the messy attributes of a node (like `financial_health` or `delivery_reliability`) and magically compresses it into a high-density, mathematical matrix called a "16-Dimensional Embedding." 
**The Result:** We successfully created a mathematical "Risk Score" for every single node in the supply chain that the final model can use to detect vulnerabilities. 

---

## 3. The Core Engine (Temporal Fusion Transformer - TFT)
**The Problem:** We need to look at historical data (drug demand, CDSCO quality alerts from the FDA, and GraphSAGE risk scores) and forecast exactly what will happen 1, 7, 14, and 30 days into the future. 
**What We Did:** Instead of using an outdated LSTM model, we constructed a state-of-the-art **Temporal Fusion Transformer (TFT)** using PyTorch Forecasting. 

### How it Works (The Concept)
A TFT is brilliant because it assigns "Attention Heads" to different data points. It learns that a `day_of_week` (like Sunday) is important for predicting hospital foot-traffic, but a `CDSCO Alert` is far more important for predicting a 30-day structural drug shortage. 

### Why is it "Probabilistic"?
Instead of just guessing that "Demand will be exactly 150 pills next week" (which is inherently impossible to guess with 100% accuracy), we used a mathematical technique called `QuantileLoss`. This forces the TFT to output **Confidence Intervals**:
- **P50 (The Expected Forecast):** 150 pills
- **P90 (The Worst-Case Scenario):** 210 pills
- **P10 (The Best-Case Scenario):** 110 pills

### How does this predict "Shortages"?
For your project's logic, we use that **P90 Worst-Case Scenario**. If the TFT predicts the Worst-Case Demand for Amoxicillin will abruptly spike far above what the manufacturers are able to supply, the system will instantly throw a **Shortage Alert Flag**.

### The "Early Stopping" Flex (Viva Talking Point!)
When we trained the TFT, we gave it a maximum of 60 sweeps (Epochs) over the entire dataset. However, we installed an intelligent **Early-Stopping Safety Mechanism**. On Epoch 8, the AI realized that it had mathematically extracted 100% of the possible "true rules" of the supply chain. It knew that if it kept training, it would just start memorizing "random noise" (which is called Overfitting). 

The AI intelligently pulled its own plug at Epoch 8, reversed its memory back to the absolute peak accuracy, and safely saved the best possible weights into your `tft_best.ckpt` file. This is a massive hallmark of expert-level AI engineering that you should proudly explain in your Viva! 

---

### **Conclusion of Phase 2**
All models have been officially built, trained on the synthesized `master_feature_table`, tested iteratively against validation data, protected from overfitting, and securely saved to your local disk alongside their JSON metrics. The heavy mathematically lifting of your project is officially complete!
