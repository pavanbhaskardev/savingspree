import { Children, createContext, useContext, useState } from "react";
import { db } from "@/firebase/firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useDisclosure } from "@chakra-ui/react";
import moment from "moment";
// import { useToast } from "@chakra-ui/react";
// const getRef = collection(db, "data", "8OOyRCiPmX6fxoNsHClI", "newList");

const databaseContext = createContext();

const useDatabaseContext = () => {
  return useContext(databaseContext);
};

const DatabaseProvider = ({ children }) => {
  const [databaseResponseForAllPlans, setDatabaseResponseForAllPlans] =
    useState([]);
  const [
    databaseResponseForAllTransactions,
    setDatabaseResponseForAllTransactions,
  ] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userAction, setUserAction] = useState(false);
  const [userIncome, setUserIncome] = useState(0);
  const [userExpense, setUserExpense] = useState(0);
  const [userTotal, setUserTotal] = useState(0);
  const [expensesList, setExpensesList] = useState([]);
  const [expensesDateList, setExpensesDateList] = useState([]);
  // data for donut chart
  const [donutExpensesCategory, setDonutExpensesCategory] = useState([]);
  const [donutExpensesAmount, setDonutExpensesAmount] = useState([]);
  const [donutIncomeCategory, setDonutIncomeCategory] = useState([]);
  const [donutIncomeAmount, setDonutIncomeAmount] = useState([]);
  const [spinnerStatus, setSpinnerStatus] = useState(false);

  // const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const allPlansRef = collection(db, "data");

  //create a new plan
  const createNewPlan = async (planName, uid, time, setModalStatus) => {
    setIsLoading(true);
    try {
      const response = await addDoc(allPlansRef, {
        planName: planName,
        uid: uid,
        createdOn: time,
      });
      setUserAction((current) => !current);
      setModalStatus(false);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  //update plan name
  const updatePlanName = async (id, newPlanName, setModalStatus) => {
    setIsLoading(true);
    const updatePlanRef = doc(db, "data", id);
    try {
      const response = await updateDoc(updatePlanRef, {
        planName: newPlanName,
      });
      setModalStatus(false);
      setUserAction((current) => !current);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  //delete plan name
  const deletePlanName = async (id) => {
    setIsLoading(true);
    const deletePlanRef = doc(db, "data", id);
    try {
      const response = await deleteDoc(deletePlanRef);
      setUserAction((current) => !current);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  //api call to get all plans created by user
  const getAllPlans = async (uid) => {
    const q = query(
      collection(db, "data"),
      where("uid", "==", uid || ""),
      orderBy("createdOn", "desc")
    );
    setSpinnerStatus(true);
    try {
      const response = await getDocs(q);
      setDatabaseResponseForAllPlans(
        response.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    } catch (error) {
      console.log(error);
    }
    setSpinnerStatus(false);
  };

  // add transaction
  const addTransaction = async (transactionData, docId, setModalStatus) => {
    setIsLoading(true);
    const docRef = collection(db, "data", docId, "newList");
    try {
      const response = await addDoc(docRef, transactionData);
      setUserAction((current) => !current);
      setModalStatus(false);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // delete transaction
  const deleteTransaction = async (docId, id) => {
    setIsLoading(true);
    const transactionRef = doc(db, "data", docId, "newList", id);
    try {
      const response = await deleteDoc(transactionRef);
      setUserAction((current) => !current);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // Donut Chart data
  const formattedActionList = (statisticsForExpense, statisticsForIncome) => {
    let formattedExpensesList = [];
    let formattedIncomeList = [];

    statisticsForExpense.reduce((prev, curr) => {
      const { amount, category } = curr;
      if (!prev[category]) {
        prev[category] = { amount: amount, category: category };
        formattedExpensesList.push(prev[category]);
      }
      prev[category].amount = prev[category].amount + amount;
      return prev;
    }, {});

    statisticsForIncome.reduce((prev, curr) => {
      const { amount, category } = curr;
      if (!prev[category]) {
        prev[category] = { amount: amount, category: category };
        formattedIncomeList.push(prev[category]);
      }
      prev[category].amount = prev[category].amount + amount;
      return prev;
    }, {});

    return { formattedExpensesList, formattedIncomeList };
  };

  //Sorting data for donut chart
  const sortingDataforDonutChart = (
    statisticsForExpense,
    statisticsForIncome
  ) => {
    const list = formattedActionList(statisticsForExpense, statisticsForIncome);

    let expensesAmount = [];
    let expensesCategory = [];
    let incomeAmount = [];
    let incomeCategory = [];

    list?.formattedExpensesList.map((data) => {
      const { category, amount } = data;
      expensesAmount.push(amount / 2);
      expensesCategory.push(category);
    });

    list?.formattedIncomeList.map((data) => {
      const { category, amount } = data;
      incomeAmount.push(amount / 2);
      incomeCategory.push(category);
    });
    setDonutExpensesAmount(expensesAmount);
    setDonutExpensesCategory(expensesCategory);
    setDonutIncomeCategory(incomeCategory);
    setDonutIncomeAmount(incomeAmount);
  };

  //get all statistics like income and expenses
  const getStatistics = (response) => {
    const allData = response.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    let income = 0;
    let expenses = 0;
    let expensesList = [];
    let expensesDateList = [];
    let statisticsForExpense = [];
    let statisticsForIncome = [];
    allData.map((transaction) => {
      const { type, amount, time } = transaction;
      if (type === "income") {
        statisticsForIncome.push(transaction);
        income = income + amount;
      } else if (type === "expense") {
        statisticsForExpense.push(transaction);
        expensesList.push(amount);
        expensesDateList.push(moment(time.seconds * 1000).format("MMM D, YY"));
        expenses = expenses + amount;
      }
    });
    const total = income - expenses;
    setUserIncome(income);
    setUserExpense(expenses);
    setUserTotal(total);
    //Line chart data
    setExpensesList(expensesList.reverse());
    setExpensesDateList(expensesDateList.reverse());
    //Donut chart data
    if (statisticsForExpense || statisticsForIncome) {
      sortingDataforDonutChart(statisticsForExpense, statisticsForIncome);
    }
  };

  // api call to get all transactions created by user
  const getAllTransactions = async (docId) => {
    const q = query(
      collection(db, "data", docId, "newList"),
      orderBy("time", "desc")
    );
    setSpinnerStatus(true);

    try {
      const response = await getDocs(q);
      setDatabaseResponseForAllTransactions(
        response.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
      if (response) {
        getStatistics(response);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinnerStatus(false);
  };

  const contextValue = {
    databaseResponseForAllPlans,
    databaseResponseForAllTransactions,
    isLoading,
    userAction,
    userIncome,
    userExpense,
    userTotal,
    spinnerStatus,
    expensesList,
    expensesDateList,
    // all data for donut chart
    donutExpensesAmount,
    donutExpensesCategory,
    donutIncomeAmount,
    donutIncomeCategory,
    createNewPlan,
    updatePlanName,
    deletePlanName,
    getAllPlans,
    addTransaction,
    deleteTransaction,
    getAllTransactions,
  };
  return (
    <databaseContext.Provider value={contextValue}>
      {children}
    </databaseContext.Provider>
  );
};

export { DatabaseProvider, databaseContext, useDatabaseContext };
