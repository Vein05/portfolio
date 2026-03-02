---
title: "Reflections on my AI/ML Internship"
date: "2024-12-10"
category: "Career"
status: "DRAFT"
---

# Interning at Prediction3d

My time as an AI and Machine Learning intern at Prediction3d was a massive period of growth. Transitioning from academic coursework to production models is a steep learning curve, but incredibly rewarding.

## The Gap Between Theory and Practice

In school, you are typically handed a clean dataset (like MNIST or Titanic) and told to build a model. In the real world, the data is messy, incomplete, and sometimes explicitly wrong.

### Data Cleaning is 80% of the Job

I spent far more time writing Pandas and Numpy scripts to clean and normalize data pipelines than I did actually tuning hyperparameters in PyTorch or TensorFlow.

## Model Optimization techniques

We had models that performed well contextually but were too slow or resource-heavy for production edge deployment. I learned several optimization techniques:

1. **Quantization**: Converting FP32 weights to INT8, significantly reducing model size with minimal accuracy loss.
2. **Pruning**: Removing near-zero weights from the network to compress the architecture.
3. **ONNX Export**: Getting models out of native PyTorch and into ONNX runtime for cross-platform inference speedups.

> Productionizing ML is less about finding the exact perfect theoretical architecture, and more about finding the "good enough" architecture that fits into memory and runs in <50ms.

## Takeaways

The most valuable thing I learned wasn't a specific framework API, but rather the intuition of diagnosing a badly behaving model. Understanding *why* a gradient is vanishing or *why* the loss curve resembles a chaotic heartbeat is what separates a practitioner from someone just copying tutorials.
