import { GoogleGenerativeAI } from "@google/generative-ai";
import { collection, getDocs, query, where, getFirestore } from "firebase/firestore";
import api from "../constants/api";

const genAI = new GoogleGenerativeAI(api.GEMINI_API_KEY);

export const getChatResponse = async (userMessage, email) => {
  try {
    let orderHistory = "";

    if (email) {
      const q = query(collection(getFirestore(), "orders"), where("email", "==", email));
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => doc.data());
      orderHistory = JSON.stringify(orders.slice(-3), null, 2);
    }

    const prompt = `
You are a helpful assistant for Amcros Hitex Pvt Ltd, a socks manufacturing company.
Your job is to answer customer queries based on their past orders.

Recent Orders:
${orderHistory}

Answer this user question in a helpful and friendly tone:
"${userMessage}"
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    return await result.response.text();
  } catch (err) {
    console.error("Gemini chatbot error:", err);
    return "Sorry, I'm having trouble answering that right now.";
  }
};
