interface ParsedTransaction {
  amount: string;
  type: "income" | "expense";
  category: string;
  title: string;
  date: string;
}

const categoryKeywords: Record<string, string> = {
  food: "Food",
  groceries: "Food",
  grocery: "Food",
  restaurant: "Food",
  dining: "Food",
  eat: "Food",
  rent: "Rent",
  lease: "Rent",
  bills: "Bills",
  bill: "Bills",
  utilities: "Bills",
  utility: "Bills",
  electricity: "Bills",
  water: "Bills",
  transport: "Transport",
  transportation: "Transport",
  taxi: "Transport",
  uber: "Transport",
  gas: "Transport",
  fuel: "Transport",
  entertainment: "Entertainment",
  movie: "Entertainment",
  game: "Entertainment",
  fun: "Entertainment",
};

const incomeKeywords = ["income", "salary", "received", "earned", "got"];
const expenseKeywords = ["expense", "spent", "paid", "bought", "purchase"];

export function parseVoiceCommand(transcript: string): ParsedTransaction | null {
  const normalized = transcript.toLowerCase().trim();

  const amountMatch = normalized.match(/₹?\s*([0-9,]+(?:\.[0-9]{1,2})?)/);
  if (!amountMatch) {
    return null;
  }

  const amount = amountMatch[1].replace(/,/g, "");

  let type: "income" | "expense" = "expense";
  
  for (const keyword of expenseKeywords) {
    if (normalized.includes(keyword)) {
      type = "expense";
      break;
    }
  }
  
  if (type === "expense") {
    for (const keyword of incomeKeywords) {
      if (normalized.includes(keyword)) {
        type = "income";
        break;
      }
    }
  }

  let category = "Other";
  let categoryKeyword = "";
  for (const [keyword, cat] of Object.entries(categoryKeywords)) {
    if (normalized.includes(keyword)) {
      category = cat;
      categoryKeyword = keyword;
      break;
    }
  }

  let title = "";
  const forMatch = normalized.match(/for\s+(.+?)(?:\s+(?:on|yesterday|today|tomorrow)|\s*$)/);
  if (forMatch) {
    title = forMatch[1].trim();
  } else {
    const remainingText = normalized
      .replace(/₹?\s*[0-9,]+(?:\.[0-9]{1,2})?/, "")
      .replace(/\b(add|expense|income|spent|paid|received|earned|bought|purchase|for|the|was|is)\b/g, "")
      .trim();
    
    if (remainingText) {
      title = remainingText;
    } else if (categoryKeyword) {
      title = categoryKeyword;
    } else {
      title = `${type}`;
    }
  }

  title = title.charAt(0).toUpperCase() + title.slice(1);
  
  if (!title || title.trim().length === 0) {
    title = category !== "Other" ? category : `${type.charAt(0).toUpperCase() + type.slice(1)}`;
  }

  let date = new Date().toISOString().split("T")[0];
  if (normalized.includes("yesterday")) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    date = yesterday.toISOString().split("T")[0];
  } else if (normalized.includes("tomorrow")) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    date = tomorrow.toISOString().split("T")[0];
  }

  return {
    amount,
    type,
    category,
    title,
    date,
  };
}
