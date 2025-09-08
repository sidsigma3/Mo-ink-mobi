import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator , Modal , TextInput, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons"; // You can swap icons as needed
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
// Custom components (you’ll need to make these React Native versions)
// import TopNavigation from "../../Components/TopNavigation/TopNavigation";
import NavbarHeader from "../../Components/NavBarHeader/NavbarHeader";
import Navbar from "../../Components/Navbar/Navbar";
import Cta from "../../Components/Cta/Cta";
import Footer from "../../Components/Footer/Footer";
import HeroSection from "../../Components/HeroSection/HeroSection";
import ProductDetailBoxMini from "../../Components/ProductList/ProductDetailBoxMini";
import BottomNav from "../../Components/BottomNav/BottomNav";
import AddressBox from "../../Components/AddressBox/AddressBox";
import ModalSuccess from "../../Components/Modal/ModalSuccess";
import ModalCoupon from "../../Components/Modal/ModalCoupon";
import Toast from "../../Components/Toast/Toast";
import ProductDetailBoxMiniMobile from "../../Components/ProductList/ProductDetailBoxMiniMobile";

// Services
import { getCart , removeFromCart ,addToCart } from "../../Service/CartService";
import { fetchProducts } from "../../Service/ProductService";
import { getAllDiscounts } from "../../Service/DiscountService";
import { getWalletTransactions , getCustomerDetails } from "../../Service/CustomerService";
import { createOrder , updateOrderStatuses } from "../../Service/OrderService";
import { initiatePayment } from "../../Service/PaymentService";
import { useAppContext } from "../../Utils/AppContext";
import RazorpayCheckout from 'react-native-razorpay';
const razorpayKey = process.env.RAZORPAY_CLIENT_KEY;

// --- Utility Functions ---
const getOrderItemDiscountDetails = ({
  coupon,
  item,
  itemTotal,
  totalCartWeight,
  totalCartValue,
  paymentDiscountPercent,
}) => {
  const isEligibleProduct = coupon?.applicableProducts?.some((p) => p.id === item.productId);
  if (!isEligibleProduct) {
    return { allowed: false, itemDiscount: (itemTotal * paymentDiscountPercent) / 100 };
  }

  const requirement = coupon?.minPurchaseRequirement || "";
  let requirementMet = true;

  if (requirement.includes("Minimum purchase amount")) {
    const match = requirement.match(/\₹\s?(\d+)/);
    const minAmount = match ? Number(match[1]) : 0;
    requirementMet = totalCartValue >= minAmount;
  } else if (requirement.includes("Minimum quantity required")) {
    const match = requirement.match(/(\d+)/);
    const minQty = match ? Number(match[1]) : 0;
    requirementMet = totalCartWeight >= minQty;
  }

  if (!requirementMet) {
    return { allowed: false, itemDiscount: (itemTotal * paymentDiscountPercent) / 100 };
  }

  const couponValue = Number(coupon.discountValue || 0);
  const discountType = coupon.discountType;

  if (discountType === "FixedAmount") {
    const proportion = itemTotal / totalCartValue;
    const itemFixedDiscount = couponValue * proportion;

    const afterFixed = itemTotal - itemFixedDiscount;
    const paymentDiscount = (afterFixed * paymentDiscountPercent) / 100;

    return { allowed: true, itemDiscount: itemFixedDiscount + paymentDiscount };
  } else {
    const combinedPercent =
      couponValue + paymentDiscountPercent - (couponValue * paymentDiscountPercent) / 100;
    return { allowed: true, itemDiscount: (itemTotal * combinedPercent) / 100 };
  }
};

const CheckoutPage = () => {
  const navigation = useNavigation();
  const { updateCartAndWishlistCounts } = useAppContext();
  
  // States
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("100% Online and 0% COD");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("HOME");
  const [selectedItems, setSelectedItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [variantTypes, setVariantTypes] = useState({});
  const [quantities, setQuantities] = useState({});
  const lastTapRef = useRef(0);
  const singleClickTimeoutRef = useRef(null);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [walletUsed, setWalletUsed] = useState(0);
  const [walletError, setWalletError] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState({});
  const [showModal, setShowModal] = useState(false);
  const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.variantId));

  const platformFees = 0;

  // Replace localStorage with AsyncStorage
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    const fetchAndStore = async () => {
      try {
        const data = await getCustomerDetails(1); // 🔥 always fetch
        await AsyncStorage.setItem("userData", JSON.stringify(data.data)); // store
        setCustomer(data.data); // set state

      } catch (error) {
        console.error("❌ Error fetching customer:", error);
      }
    };

    fetchAndStore();
  }, []);

  
   
  const customerId = customer?.customerId;
  const billingAddress = customer?.addresses?.find((addr) => addr.addressType === "HOME");
  const selectedAddress =
    (customer?.addresses || []).find((addr) => addr.addressType === selectedType) ||
    customer?.addresses?.[0] ||
    null;

      const fetchOrders = useCallback(async () => {
        if (!customer?.customerId) return;
        setLoading(true);
        try {
          
            const cartResponse = await getCart(customer.customerId);
            const cartData = cartResponse?.cartItems || [];
          
           
            const productResponse = await fetchProducts();
            const allProducts = productResponse?.data || [];
    
            
            const cartProducts = cartData.map((item) => {
                const product = allProducts.find((p) =>
                    p.variants.some((v) => v.id === item.variantId)
                );
                const variant = product?.variants.find((v) => v.id === item.variantId);
    
                if (!product || !variant) {
                    console.warn(`Variant ID ${item.variantId} not found`);
                    return null;
                }
    
                return {
                    productId: product.id,
                    productName: product.productName,
                    size: variant.size,
                    colorName: variant.color?.colorName,
                    hexCode:variant.color?.colorCode,
                    price: variant.pricePerKg,
                    markupPrice:variant.markupPricePerKg,
                    variantId: variant.id,
                    quantity: item.quantity || 1,
                    productImage: product.productImage || "/images/default.png",
                    colorImage:variant.color?.colorImage,
                    gstRate: product.gstOnProduct || 0,
                    variantType: variant.variantType || "Cone", // ← Now pulled directly from variant
                };
            }).filter(Boolean);
    
            setCartItems(cartProducts);
        } catch (error) {
            console.error("Failed to fetch cart items:", error);
        } finally {
            setLoading(false);
        }
    }, [customer?.customerId, setCartItems]);


   useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

  // Auto-select weights
  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedWeight((prev) => {
        const newWeights = { ...prev };
        cartItems.forEach((item) => {
          if (!newWeights[item.variantId]) {
            newWeights[item.variantId] = 10;
          }
        });
        return newWeights;
      });
    }
  }, [cartItems]);

  useEffect(() => {
        if (cartItems.length > 0) {
            const allVariantIds = cartItems.map(item => item.variantId);
            setSelectedItems(allVariantIds);
        }
    }, [cartItems]);

     const handleRemoveFromCart = async (variantId) => {
    if (!customer?.customerId) {
      setToasts([{ message: "Please log in to manage your cart.", type: "error" }]);
      setTimeout(() => setToasts([]), 3000);
      return;
    }

    try {
      await removeFromCart(customer.customerId, variantId);
      fetchOrders(); // if you imported it
      updateCartAndWishlistCounts();
      setToasts([{ message: "Item removed from cart!", type: "success" }]);
    } catch (error) {
      setToasts([{ message: "Failed to remove item from cart!", type: "error" }]);
    }

    setTimeout(() => setToasts([]), 3000);
  };

  const handleVariantTypeChange = (variantId, type) => {
    setVariantTypes((prev) => ({
      ...prev,
      [variantId]: type,
    }));
  };

  const handleQuantityChange = (variantId, newQty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.variantId === variantId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        if (!customer?.customerId) return;
        const transactions = await getWalletTransactions(customer.customerId);
        if (transactions && transactions.length > 0) {
          const latest = transactions[transactions.length - 1];
          setWalletBalance(latest.totalAmount || 0);
        }
      } catch (error) {
        console.error("Failed to fetch wallet balance", error);
      }
    };
    fetchWalletBalance();
  }, [customer?.customerId]);

  const calculateHandlingCharges = (cartItems, selectedAddress) => {
        if (!selectedAddress?.state) return 0;
      
        const customerState = selectedAddress.state.toLowerCase();
        const ratePerKg = customerState === "odisha" ? 3 : 5;
      
        // Sum total weight from cart items
        const totalWeight = cartItems.reduce((acc, item) => {
          const unitWeight = selectedWeight[item.variantId]; 
          const weight = Number(item.quantity) * unitWeight || 0; // assuming 1 quantity = 1kg
          return acc + weight;
        }, 0);
      
        return Number((totalWeight * ratePerKg).toFixed(2));
      };


       useEffect(() => {
        if (isSidebarOpen) {
          fetchDiscounts();
        }
    }, [isSidebarOpen]);

     const handleCheckboxChange = (variantId) => {
        setSelectedItems(prev =>
            prev.includes(variantId)
                ? prev.filter(id => id !== variantId)
                : [...prev, variantId]
        );
    };
    const fetchDiscounts = async () => {
        try {
            setLoading(true);
            const data = await getAllDiscounts();
            setDiscounts(data.data);
        } catch (error) {
            console.error("Failed to load discounts", error);
        } finally {
            setLoading(false);
        }
    };



    const totalCartWeight = selectedCartItems.reduce((acc, item) => {
        const unit = selectedWeight[item.variantId];
        return acc + (item.quantity * unit);
    }, 0);

    const totalCartValue = selectedCartItems.reduce((acc, item) => {
        const unit = selectedWeight[item.variantId];
        return acc + (item.price * item.quantity * unit);
    }, 0);

     const checkDiscountEligibility = ({
  discount,
  totalCartWeight,
  totalCartValue,
  customerId,
  applicableProductIds
}) => {
  // Customer eligibility
  const isCustomerEligible =
    discount.customerEligibilityType === "All" ||
    discount.eligibleCustomers?.some(c => c.customerId === customerId);

  if (!isCustomerEligible)
    return { allowed: false, reason: "Not eligible customer" };

  // Discount must be active
  if (discount.discountStatus !== "ACTIVE")
    return { allowed: false, reason: "Inactive discount" };

  // Product eligibility
  const hasApplicableProduct = discount.applicableProducts?.some(p =>
    applicableProductIds.includes(p.id)
  );
  if (!hasApplicableProduct)
    return { allowed: false, reason: "No eligible products in cart" };

  // Min purchase requirements
  let requirementMet = true;
  let reason = "";

  if (
    discount.minPurchaseRequirement.includes(
      "No minimum purchase requirement"
    )
  ) {
    requirementMet = true;
    reason = "";
  } else if (
    discount.minPurchaseRequirement.includes("Minimum purchase amount")
  ) {
    const match = discount.minPurchaseRequirement.match(/₹\)?\s*:\s*(\d+)/);
    const minAmount = match ? Number(match[1]) : 0;
    requirementMet = totalCartValue >= minAmount;
  
    if (!requirementMet) reason = `Spend ₹${minAmount} or more`;
  } else if (
    discount.minPurchaseRequirement.includes("Minimum quantity required")
  ) {
    const match = discount.minPurchaseRequirement.match(/(\d+)/);
    const minQty = match ? Number(match[1]) : 0;
    requirementMet = totalCartWeight >= minQty;
    if (!requirementMet) reason = `Buy at least ${minQty}kg`;
  }

  return { allowed: requirementMet, reason };
};

   const eligibleDiscounts = discounts
    .filter(discount => discount.discountStatus === "ACTIVE") 
    .map(discount => {
        const result = checkDiscountEligibility({
        discount,
        totalCartWeight,
        totalCartValue,
        customerId,
        applicableProductIds: cartItems.map(item => item.productId)
        });
        return { ...discount, allowed: result.allowed, reason: result.reason };
    });
    
    const filteredDiscounts = eligibleDiscounts.filter(discount =>
        discount.discountCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

     
      console.log(filteredDiscounts,'filteredDiscounts')

      
     useEffect(() => {
        if (!appliedCoupon) return;

        // Re-check eligibility for the currently applied coupon
        const { allowed, reason } = checkDiscountEligibility({
            discount: appliedCoupon,
            totalCartWeight,
            totalCartValue,
            customerId,
            applicableProductIds: selectedCartItems.map(item => item.productId)
        });

        if (!allowed) {
            setAppliedCoupon(null);
            showToast(reason || "Discount removed due to cart changes");
        }
    }, [totalCartWeight, totalCartValue, selectedCartItems, appliedCoupon]);
    
 


   const paymentDiscountMap = {
        "100% Online and 0% COD": 1.5,
        "50% Online and 50% COD": 0.5,
        "30% Online and 70% COD": 0.3,
        "25% Online and 75% COD": 0.5,
        "0% Online and 100% COD": 0,
    };

const breadcrumbs = [
        { label: "Home", link: "/home" },
        { label: "Account", link: "/account" },
        { label: "Shopping Cart", link: "/shoppingCart" }
    ];

    const getPaymentSplit = (paymentOption) => {
        const regex = /(\d+)% Online and (\d+)% COD/;
        const match = paymentOption.match(regex);
        if (match) {
            return {
                online: parseInt(match[1], 10),
                cod: parseInt(match[2], 10),
            };
        } else {
            return {
                online: 0,
                cod: 100,
            };
        }
    };

  const { online, cod } = getPaymentSplit(selectedPayment);

  const getCouponDiscountDetails = (coupon, item, itemTotal, totalCartWeight, totalCartValue) => {
    if (!coupon) return { allowed: false, amount: 0, percent: 0 };

  const isEligibleProduct = coupon.applicableProducts?.some(p => p.id === item.productId);
    if (!isEligibleProduct) return { allowed: false, amount: 0, percent: 0 };

  const requirement = coupon.minPurchaseRequirement || "";
  let requirementMet = true;

  if (requirement.includes("Minimum purchase amount")) {
    const match = requirement.match(/₹\s?(\d+)/);
    const minAmount = match ? Number(match[1]) : 0;
    requirementMet = totalCartValue >= minAmount;
  } else if (requirement.includes("Minimum quantity required")) {
    const match = requirement.match(/(\d+)/);
    const minQty = match ? Number(match[1]) : 0;
    requirementMet = totalCartWeight >= minQty;
  }

  if (!requirementMet) return { allowed: false, amount: 0, percent: 0 };

  if (coupon.discountType === "FixedAmount") {
    const totalDiscount = Number(coupon.discountValue || 0);
    // Calculate this item's proportional share of the total discount
    const itemSharePercent = itemTotal / totalCartValue;
    const amount = totalDiscount * itemSharePercent;
    const percent = (amount / itemTotal) * 100;
    return { allowed: true, amount, percent };
  } else {
    const percent = Number(coupon.discountValue || 0);
    const amount = (itemTotal * percent) / 100;
    return { allowed: true, amount, percent };
  }
};

     const {
  totalProductCost,
  discountByPayment,
  discountByCoupon,
  totalDiscount,
  finalTotal,
  gstAmount,
  netPayable,
  adjustedNetPay,
  onlinePay,
  codPay,
  totalDiscountPercentage,
  handlingCharges,
} = useMemo(() => {
  let totalProductCost = 0;
  let discountByPayment = 0;
  let discountByCoupon = 0;
  let gstAmount = 0;
  let totalCartWeight = 0;

  const paymentDiscountPercent = Number(paymentDiscountMap[selectedPayment] || 0);



  // Pre-calculate total cart weight and value
  selectedCartItems.forEach(item => {
    const unitWeight = selectedWeight[item.variantId]
    const itemWeight = item.quantity * unitWeight;
    const itemTotal = item.price * itemWeight;
    totalCartWeight += itemWeight;
    totalProductCost += itemTotal;
  });



  selectedCartItems.forEach(item => {
    const unitWeight = selectedWeight[item.variantId]
    const itemWeight = item.quantity * unitWeight;
    const itemTotal = item.price * itemWeight;
    const gstRate = item.gstRate || 0;

    const { allowed, amount: couponDiscountAmount, percent: couponPercent } =
      getCouponDiscountDetails(appliedCoupon, item, itemTotal, totalCartWeight, totalProductCost);

    const subtotalAfterCoupon = itemTotal - couponDiscountAmount;

    const paymentDiscountAmount = (subtotalAfterCoupon * paymentDiscountPercent) / 100;

    const discountedTotal = subtotalAfterCoupon - paymentDiscountAmount;
    const gstForItem = (discountedTotal * gstRate) / 100;

    gstAmount += gstForItem;
    discountByCoupon += allowed ? couponDiscountAmount : 0;
    discountByPayment += paymentDiscountAmount;
  });

  const handlingCharges = calculateHandlingCharges(selectedCartItems, selectedAddress);
  const totalDiscount = discountByCoupon + discountByPayment;
  const finalTotal = totalProductCost - totalDiscount;
  const netPayable = finalTotal + gstAmount + handlingCharges + platformFees;
  const adjustedNetPay = Math.max(netPayable - walletUsed, 0);
  const onlinePay = (online / 100) * adjustedNetPay;
  const codPay = (cod / 100) * adjustedNetPay;

  const totalDiscountPercentage =
    ((discountByCoupon + discountByPayment) / totalProductCost) * 100;

  return {
    totalProductCost,
    discountByPayment,
    discountByCoupon,
    totalDiscount,
    finalTotal,
    gstAmount,
    netPayable,
    adjustedNetPay,
    onlinePay,
    codPay,
    totalDiscountPercentage,
    handlingCharges,
  };
}, [selectedCartItems, selectedPayment, appliedCoupon, walletUsed, platformFees, online, cod, selectedAddress]);

   const handleWalletChange = (e) => {
        const value = e.target.value;

        if (value === '') {
            setWalletUsed(0);
            setWalletError('');
            return;
        }

        if (/^\d+$/.test(value)) {
            const numericValue = Number(value);

            if (numericValue > walletBalance) {
                setWalletError('Please enter value less than wallet balance');
            } else {
                setWalletError('');
                setWalletUsed(numericValue);
            }
        }

         const maxUsable = Math.min(walletBalance, netPayable);

        if (value > maxUsable) {
            setWalletError(`Amount should not exceed ₹${Math.round(maxUsable).toLocaleString()}`);
        } else {
            setWalletUsed(value);
            setWalletError('');
        }
        };

const handleCouponClick = (discount) => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
            clearTimeout(singleClickTimeoutRef.current);
            setAppliedCoupon(discount);
        } else {

            singleClickTimeoutRef.current = setTimeout(() => {
                let savings = 0;

                if (discount.discountType === 'Percentage') {
                    savings = (totalProductCost * discount.discountValue) / 100;
                } else {
                    savings = discount.discountValue;
                }

                setAppliedCoupon(discount);
                // alert(`You have saved Rs ${savings.toFixed(2)}/- amount on your order`);
                setShowModal(true);
            setTimeout(() => {
            setShowModal(false);
        }, 3000);
            }, DOUBLE_TAP_DELAY);
        }

        lastTapRef.current = now;
        setIsSidebarOpen(false);
    };


 const extractPaymentTypeDiscount = (paymentTypeLabel) => {
        return paymentTypeLabel?.split(" ")[0] || "";
      };


       const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };

    const buildDetailedOrderVariants = (cartItems) => {
  const paymentDiscount = paymentDiscountMap[selectedPayment] || 0;
  const coupon = appliedCoupon || null;

  const billingState = customer?.addresses?.find(addr => addr.addressType === "HOME")?.state?.toLowerCase() || "";
  const customerState = selectedAddress?.state?.toLowerCase() || "";
  const ratePerKg = customerState === "odisha" ? 3 : 5;

  const totalCartWeight = cartItems.reduce((acc, item) => {
    const unit = selectedWeight[item.variantId];
    return acc + (item.quantity * unit);
  }, 0);

  const totalCartValue = cartItems.reduce((acc, item) => {
    const unit = selectedWeight[item.variantId];
    return acc + (item.price * item.quantity * unit);
  }, 0);

  return cartItems
    .filter(item => item.variantId && item.quantity > 0)
    .map(item => {
      const unitWeight = selectedWeight[item.variantId];
      const itemWeight = item.quantity * unitWeight;
      const itemTotal = item.price * item.quantity * unitWeight;
      const gstRate = item.gstRate || 0;

      const { itemDiscount } = getOrderItemDiscountDetails({
        coupon,
        item,
        itemTotal,
        totalCartWeight,
        totalCartValue,
        paymentDiscountPercent: paymentDiscount
      });

      const discountedTotal = itemTotal - itemDiscount;
      const gstForItem = (discountedTotal * gstRate) / 100;

      const cgst = billingState === "odisha" ? gstForItem / 2 : 0;
      const sgst = billingState === "odisha" ? gstForItem / 2 : 0;
      const igst = billingState !== "odisha" ? gstForItem : 0;

      const handlingCharges = totalCartWeight > 0
        ? (itemWeight / totalCartWeight) * (totalCartWeight * ratePerKg)
        : 0;

      return {
        variantId: item.variantId,
        orderWeight: itemWeight,
        variantType: item.variantType || "Cone",
        orderVariantCgst: Number(cgst.toFixed(0)),
        orderVariantSgst: Number(sgst.toFixed(0)),
        orderVariantIgst: Number(igst.toFixed(0)),
        orderVariantDiscount: Number(itemDiscount.toFixed(0)),
        orderVariantHandlingCharges: Number(handlingCharges.toFixed(0)),
        orderVariantTotalAmount: Number((discountedTotal + gstForItem + handlingCharges).toFixed(0)),
        status: "NEW",
        statusReason: null,
        statusRemark: null,
      };
    });
};

      
      const buildDetailedOrderVariantsForPayment = (cartItems) => {
        const unitWeight = 50;
        const paymentDiscount = paymentDiscountMap[selectedPayment] || 0;
        const productDiscount = appliedCoupon?.discountValue ? Number(appliedCoupon.discountValue) : 0;
      
        const coupon = appliedCoupon || null;
      
        console.log(paymentDiscount,productDiscount)    

        const billingState = customer?.addresses?.find(addr => addr.addressType === "HOME").state.toLowerCase();
        const customerState = selectedAddress?.state?.toLowerCase() || "";
        const ratePerKg = customerState === "odisha" ? 3 : 5;
      
        // Total weight for proportional handling charge calculation
        const totalWeight = cartItems.reduce((acc, item) => {
            if (!item.variantId || item.quantity <= 0) return acc;
          
            const unitWeight = selectedWeight[item.variantId]; // grams
            return acc + item.quantity * unitWeight;
          }, 0);

            const totalCartWeight = cartItems.reduce((acc, item) => {
                const unit = selectedWeight[item.variantId];
                return acc + (item.quantity * unit);
            }, 0);

          const totalCartValue = cartItems.reduce((acc, item) => {
            const unit = selectedWeight[item.variantId];
            return acc + (item.price * item.quantity * unit);
        }, 0);
      
        return cartItems
          .filter(item => item.variantId && item.quantity > 0)
          .map(item => {
            const unitWeight = selectedWeight[item.variantId] ;
            const itemWeight = Number(item.quantity) * unitWeight;
            const itemTotal = item.price * item.quantity * unitWeight;
            const gstRate = item.gstRate || 0;


             const { itemDiscount    } = getOrderItemDiscountDetails({
                coupon,
                item,
                itemTotal,
                totalCartWeight,
                totalCartValue,
                paymentDiscountPercent: paymentDiscount
            });
      
            // let applicableCouponDiscount = 0;
            // if (appliedCoupon?.applicableProducts?.some(p => p.id === item.productId)) {
            //   applicableCouponDiscount = productDiscount;
            // }
      
            // const combinedDiscountPercent =
            //   applicableCouponDiscount + paymentDiscount - (applicableCouponDiscount * paymentDiscount) / 100;

            // console.log(combinedDiscountPercent)
      
            // const itemDiscount = (itemTotal * combinedDiscountPercent) / 100;
            const discountedTotal = itemTotal - itemDiscount;
            const gstForItem = (discountedTotal * gstRate) / 100;
      
            const cgst = billingState === "odisha" ? gstForItem / 2 : 0;
            const sgst = billingState === "odisha" ? gstForItem / 2 : 0;
            const igst = billingState !== "odisha" ? gstForItem : 0;
      
            const handlingCharges = totalWeight > 0 ? (itemWeight / totalWeight) * (totalWeight * ratePerKg) : 0;
      
            return {
              variantId: item.variantId,
              orderWeight: itemWeight,
              variantType: item.variantType || "Cone",
              orderVariantCgst: Number(cgst.toFixed(0)),
              orderVariantSgst: Number(sgst.toFixed(0)),
              orderVariantIgst: Number(igst.toFixed(0)),
              orderVariantDiscount: Number(itemDiscount.toFixed(0)),
              orderVariantHandlingCharges: Number(handlingCharges.toFixed(0)),
              orderVariantTotalAmount: Number((discountedTotal + gstForItem + handlingCharges).toFixed(0)),
              status: "PENDING",
              statusReason: null,
              statusRemark: null,
            };
          });
      };
     

const handleCreateOrder = async () => {
        const showToast = (message, type = "error") => {
            setToasts([{ message, type }]);
            setTimeout(() => setToasts([]), 3000);
          };

        try {

          if (!customerId) {
            showToast("Customer info missing!", "error");
            return;
          }
      
          if (selectedCartItems.length === 0) {
            showToast("Cart is empty!", "error");
            return;
          }

          const isAddressValid = (address) => {
            return (
                address &&
                address.id &&
                address.customerAddress &&
                address.city &&
                address.state &&
                address.country &&
                address.zipcode
            );
            };

            if (!isAddressValid(billingAddress)) {
            showToast("Billing address is incomplete!", "error");
            return;
            }

            if (!isAddressValid(selectedAddress)) {
            showToast("Shipping address is incomplete!", "error");
            return;
            }

         
          const orderVariants = buildDetailedOrderVariants(selectedCartItems);
          const totalQuantity = orderVariants.length;
          const totalAmount = Number(adjustedNetPay).toFixed(0);
      
          if (orderVariants.length === 0 || totalQuantity === 0) {
            showToast("No valid items or weight!", "error");
            return;
          }
      
          const walletUsedAmount = walletUsed || 0;
      
          const totalCgst = orderVariants.reduce((sum, v) => sum + Number(v.orderVariantCgst || 0), 0);
          const totalSgst = orderVariants.reduce((sum, v) => sum + Number(v.orderVariantSgst || 0), 0);
          const totalIgst = orderVariants.reduce((sum, v) => sum + Number(v.orderVariantIgst || 0), 0);

          const totalDiscount = orderVariants.reduce((sum, v) => sum + Number(v.orderVariantDiscount || 0), 0);
          const totalHandlingCharges = orderVariants.reduce((sum, v) => sum + Number(v.orderVariantHandlingCharges || 0), 0);
      
          const orderData = {
            customer: {
              customerId,
              billingAddressId: billingAddress?.id || null,
              shippingAddressId: selectedAddress?.id || null,
            },
            status: "NEW",
            totalAmount: Number(totalAmount),
            discountId: appliedCoupon?.discountId || null,
            quantity: totalQuantity,
            paymentTypeDiscount: extractPaymentTypeDiscount(selectedPayment) || "",
            payment: {
                totalAmount: Number(totalAmount),
                codAmount: Number(codPay.toFixed(0)),
                onlineAmount: Number(onlinePay.toFixed(0)),
                transactionId: "COD" + Date.now(),
                paidAmount: Number(onlinePay.toFixed(0)),
                pendingAmount: Number(codPay.toFixed(0)),
                paymentStatus: "UNPAID",
                totalDiscount: totalDiscount.toFixed(0),
                totalSgst: Number(totalSgst.toFixed(0)),
                totalCgst: Number(totalCgst.toFixed(0)),
                totalIgst: Number(totalIgst.toFixed(0)),
                totalHandlingCharges: Number(totalHandlingCharges.toFixed(0)),
                walletAmount: walletUsedAmount,
            },
            orderVariants,
          };
      
         
          const response = await createOrder(orderData);
      
          await Promise.all(
            selectedCartItems.map(item =>
              removeFromCart(customerId, item.variantId)
            )
          );
      
        updateCartAndWishlistCounts()
        //   alert("Order placed successfully!");
        setIsOrderSuccessOpen(true);
        setTimeout(() => {
        setIsOrderSuccessOpen(false);
        navigation.navigate("/order");
        }, 3000);
          
        } catch (error) {
            console.error("Order creation failed:", error);

            const errorMessage =
                error?.response?.data?.data.message || "Failed to place order";

            showToast(errorMessage, "error");
            }
      };
      console.log("RazorpayCheckout:", RazorpayCheckout);


      const handleOnlinePaymentFlow = async () => {
        let orderId = null;

        try {
          if (!customerId) {
            showToast("Customer info missing!", "error");
            return;
          }

          if (selectedCartItems.length === 0) {
            showToast("Cart is empty!", "error");
            return;
          }

          const isAddressValid = (address) => {
            return (
              address &&
              address.id &&
              address.customerAddress &&
              address.city &&
              address.state &&
              address.country &&
              address.zipcode
            );
          };

          if (!isAddressValid(billingAddress)) {
            showToast("Billing address is incomplete!", "error");
            return;
          }

          if (!isAddressValid(selectedAddress)) {
            showToast("Shipping address is incomplete!", "error");
            return;
          }

          const orderVariants = buildDetailedOrderVariantsForPayment(selectedCartItems);
          if (orderVariants.length === 0) {
            showToast("No valid items or weight!", "error");
            return;
          }

          const totalAmount = Number(adjustedNetPay).toFixed(0);
          const walletUsedAmount = walletUsed || 0;

          const orderData = {
            customer: {
              customerId,
              billingAddressId: billingAddress?.id || null,
              shippingAddressId: selectedAddress?.id || null,
            },
            status: "PENDING",
            totalAmount: Number(totalAmount),
            discountId: appliedCoupon?.discountId || null,
            quantity: orderVariants.length,
            paymentTypeDiscount: extractPaymentTypeDiscount(selectedPayment) || "",
            payment: {
              totalAmount: Number(totalAmount),
              codAmount: Number(codPay.toFixed(0)),
              onlineAmount: Number(onlinePay.toFixed(0)),
              transactionId: "COD" + Date.now(),
              paidAmount: Number(onlinePay.toFixed(0)),
              pendingAmount: Number(codPay.toFixed(0)),
              paymentStatus: "UNPAID",
              walletAmount: walletUsedAmount,
              totalDiscount: Number(
                orderVariants.reduce((sum, v) => sum + Number(v.orderVariantDiscount || 0), 0).toFixed(0)
              ),
              totalIgst: isOdisha ? 0.0 : Number(gstAmount.toFixed(0)),
              totalSgst: isOdisha ? Number((gstAmount / 2).toFixed(0)) : 0.0,
              totalCgst: isOdisha ? Number((gstAmount / 2).toFixed(0)) : 0.0,
              totalHandlingCharges: Number(
                orderVariants.reduce((sum, v) => sum + Number(v.orderVariantHandlingCharges || 0), 0).toFixed(0)
              ),
            },
            orderVariants,
          };

          // 1. Create order in your backend
          const createdOrder = await createOrder(orderData);
          orderId = createdOrder.data?.orderId;

          // 2. Ask backend to initiate Razorpay order
          const paymentData = await initiatePayment(orderId);
          const { razorpayOrderId, amount } = paymentData.data;

          if (!razorpayOrderId || paymentData.status !== "SUCCESS") {
            throw new Error("Failed to get valid Razorpay order");
          }

          // 3. Open Razorpay Checkout in RN
          const options = {
            description: `Payment for Order #${razorpayOrderId}`,
            image: 'https://yourcdn.com/logo.png', // optional
            currency: 'INR',
            key: razorpayKey, // your Razorpay key_id
            // amount: Math.round(onlinePay * 100),
            name: "Mo ink and Dye",
            order_id: razorpayOrderId,
            prefill: {
              name: customer.customerName || "",
              email: customer.email || "",
              contact: customer.phoneNumber || "",
            },
            notes: {
              orderId,
            },
            theme: { color: "#3399cc" },
          };

          RazorpayCheckout.open(options)
            .then(async (data) => {
              // Payment success
              try {
                await updateOrderStatuses(orderId, { status: "NEW" });

                await Promise.all(
                  selectedCartItems.map(item =>
                    removeFromCart(customerId, item.variantId)
                  )
                );

                updateCartAndWishlistCounts();

                navigate('/paymentSuccess');
              } catch (err) {
                console.error("Post-payment flow failed:", err);
                showToast("Payment succeeded but post-processing failed.", "error");
                navigate('/paymentFail');
              }
            })
            .catch((error) => {
              // Payment failed or cancelled
              console.error("Payment failed:", error);
              showToast("Payment failed. Please try again.", "error");
              navigate('/paymentFail');
            });

        } catch (error) {
          console.error("Order creation failed:", error);
          const errorMessage =
            error?.response?.data?.data?.message || "Failed to place order";
          showToast(errorMessage, "error");
        }
      };

      

      const billingState = customer?.addresses?.find(addr => addr.addressType === "HOME").state.toLowerCase();

      const isOdisha = billingState === "odisha";

      console.log(toasts,'toasts')
return (
  <View style={{ flex: 1 }}>

  <ScrollView style={styles.container}>
    {/* Header + Nav */}
    <View style={styles.header}>
      <NavbarHeader />
    </View>

    <HeroSection
      productName={"Shopping Cart"}
      breadcrumbs={breadcrumbs}
    />

    {/* Cart Items */}
    <Text style={styles.sectionTitle}>Review your cart</Text>
    {cartItems.length > 0 ? (
      <View>
        {/* {cartItems.map((item) => (
          <View
            key={item.variantId}
            style={[
              styles.cartItem,
              !selectedItems.includes(item.variantId) && { opacity: 0.5 },
            ]}
          >
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleRemoveFromCart(item.variantId)}
            >
              <Icon name="close" size={18} color="#6b21a8" />
            </TouchableOpacity>

            <ProductDetailBoxMini
              productName={item.productName}
              productImage={item.productImage}
              price={item.price}
              size={item.size}
              color={item.colorName}
              hexCode={item.hexCode}
              variantType={item.variantType}
              variantId={item.variantId}
              isSelected={selectedItems.includes(item.variantId)}
              onSelectChange={handleCheckboxChange}
              onVariantTypeChange={handleVariantTypeChange}
              markupPrice={item.markupPrice}
              itemQuantity={item.quantity}
              onQuantityChange={handleQuantityChange}
              colorImage={item.colorImage}
              selectedWeight={selectedWeight}
              setSelectedWeight={setSelectedWeight}
            />
          </View>
        ))} */}

        {/* Mobile-friendly list */}
        <ProductDetailBoxMiniMobile
          cartItems={cartItems}
          setCartItems={setCartItems}
          selectedItems={selectedItems}
          onSelectChange={handleCheckboxChange}
          onVariantTypeChange={handleVariantTypeChange}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemoveFromCart}
          selectedWeight={selectedWeight}
          setSelectedWeight={setSelectedWeight}
        />
      </View>
    ) : (
      <Text style={styles.noItems}>No cart items found</Text>
    )}

    {/* Shipping Address */}
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <TouchableOpacity
          style={styles.addAddressBtn}
          onPress={() => navigation.navigate("Address")}
        >
          <Text style={styles.addAddressText}>ADD NEW ADDRESS</Text>
          <Icon name="add" size={18} color="#6b21a8" />
        </TouchableOpacity>
      </View>

      {selectedAddress && (
        <View style={styles.addressBox}>
          <View>
            <Text>
              Deliver to:{" "}
              <Text style={styles.bold}>{customer.customerName}</Text>
            </Text>
            <Text>{selectedAddress.customerAddress}</Text>
            <Text>
              {selectedAddress.street}, {selectedAddress.city},{" "}
              {selectedAddress.state}
            </Text>
            <Text>
              {selectedAddress.zipcode}, {selectedAddress.country}
            </Text>
          </View>

          {/* Picker instead of Dropdown */}
          <View style={{ width: 120 }}>
            <Picker
              selectedValue={selectedType}
              onValueChange={(val) => setSelectedType(val)}
            >
              {["HOME", "WORK", "OTHER"]
                .filter((t) =>
                  customer.addresses?.some((addr) => addr.addressType === t)
                )
                .map((t) => (
                  <Picker.Item label={t} value={t} key={t} />
                ))}
            </Picker>
          </View>
        </View>
      )}
    </View>

    {/* Payment + Discounts */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment</Text>
      <Picker
        selectedValue={selectedPayment}
        onValueChange={(val) => setSelectedPayment(val)}
      >
        <Picker.Item label="100% Online and 0% COD" value="100% Online and 0% COD" />
        <Picker.Item label="50% Online and 50% COD" value="50% Online and 50% COD" />
        <Picker.Item label="0% Online and 100% COD" value="0% Online and 100% COD" />
      </Picker>

      <Text style={styles.sectionTitle}>Discounts</Text>
      <TouchableOpacity
        style={styles.discountBtn}
        onPress={() => setIsSidebarOpen(true)}
      >
        <Text>
          {appliedCoupon ? appliedCoupon.discountCode : "Select Discount"}
        </Text>
      </TouchableOpacity>
    </View>

    {/* Discount Sidebar */}
<Modal
  visible={isSidebarOpen}
  transparent
  animationType="slide"
  onRequestClose={() => setIsSidebarOpen(false)}
>
  <View style={styles.sidebarOverlay}>
    <View style={styles.sidebar}>
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => setIsSidebarOpen(false)}
      >
        <Icon name="close" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.sidebarTitle}>Apply Coupon</Text>

      <TextInput
        placeholder="Enter Coupon Code"
        style={styles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={filteredDiscounts}
        keyExtractor={(item) => item.discountId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            disabled={!item.allowed}
            onPress={() => {
              handleCouponClick(item);
            }}
            style={[
              styles.discountItem,
              appliedCoupon?.discountId === item.discountId && {
                borderColor: "#1e40af",
                borderWidth: 2,
              },
              !item.allowed && { opacity: 0.5 },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.discountCode}>{item.discountCode}</Text>
              <Text style={styles.discountSave}>
                Save ₹
                {Math.round(
                  item.discountType === "Percentage"
                    ? (Number(totalProductCost) *
                        Number(item.discountValue)) /
                        100
                    : Number(item.discountValue)
                )}{" "}
                on this order!
              </Text>
              <Text style={styles.discountText}>
                {item.minPurchaseRequirement}
              </Text>
            </View>
            {item.allowed ? (
              <Text style={styles.applyBtn}>APPLY</Text>
            ) : (
              <Text style={styles.notEligible}>Not Eligible</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noDiscounts}>No discounts available</Text>
        }
      />
    </View>
  </View>
</Modal>


    {/* Order Summary */}
    <View style={styles.summaryBox}>
      {/* Total Cost */}
      <View style={styles.row}>
        <Text style={styles.label}>Total Cost</Text>
        <Text style={styles.value}>₹{Math.round(totalProductCost).toLocaleString()}</Text>
      </View>

      {/* Discount Section */}
      <View style={styles.rowWithBorder}>
        <View>
          <Text style={styles.label}>Total Discount</Text>
          <Text style={styles.subLabel}>Pay type</Text>
          <Text style={styles.subLabel}>Coupon</Text>
        </View>
        <View>
          <Text>{totalDiscountPercentage.toFixed(2)}%</Text>
          <Text style={styles.subLabel}>
            {paymentDiscountMap[selectedPayment] !== undefined
              ? `${paymentDiscountMap[selectedPayment]}%`
              : "0.00%"}
          </Text>
          <Text style={styles.subLabel}>
            {appliedCoupon
              ? appliedCoupon.discountType === "Percentage"
                ? `${appliedCoupon.discountValue}%`
                : `₹${appliedCoupon.discountValue}`
              : "0%"}
          </Text>
        </View>
        <Text style={[styles.value, { color: "green" }]}>
          -₹{totalDiscount.toFixed(0)}
        </Text>
      </View>

      {/* Final Cost */}
      <View style={styles.row}>
        <Text style={styles.label}>Final Cost</Text>
        <Text style={styles.value}>₹{finalTotal.toFixed(0)}</Text>
      </View>

      {/* GST */}
      {isOdisha ? (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>CGST</Text>
            <Text style={styles.value}>₹{(gstAmount / 2).toFixed(0)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>SGST</Text>
            <Text style={styles.value}>₹{(gstAmount / 2).toFixed(0)}</Text>
          </View>
        </>
      ) : (
        <View style={styles.row}>
          <Text style={styles.label}>SGST</Text>
          <Text style={styles.value}>₹{gstAmount.toFixed(0)}</Text>
        </View>
      )}

      {/* Handling + Platform */}
      <View style={styles.row}>
        <Text style={styles.label}>Handling Charges</Text>
        <Text style={styles.value}>₹{handlingCharges}</Text>
      </View>
      <View style={styles.rowWithBorder}>
        <Text style={styles.label}>Platform Fees</Text>
        <Text style={styles.value}>₹{platformFees}</Text>
      </View>

      {/* Net Pay */}
      <View style={styles.row}>
        <Text style={styles.label}>Net Pay</Text>
        <Text style={styles.value}>
          ₹{Math.round(netPayable).toLocaleString()}
        </Text>
      </View>

      {/* Wallet */}
      <View style={styles.rowWithBorder}>
        <Text style={styles.label}>Wallet</Text>
        <Text style={styles.subLabel}>₹{walletBalance.toFixed(0)}</Text>
        <TextInput
          style={[styles.walletInput, walletError && { borderColor: "red" }]}
          placeholder="Amount"
          keyboardType="numeric"
          value={walletUsed === 0 ? "" : String(walletUsed)}
          onChangeText={handleWalletChange}
        />
        {walletError && <Text style={styles.errorText}>{walletError}</Text>}
      </View>

      {/* To Pay */}
      <View style={styles.rowWithBorder}>
        <Text style={styles.label}>To Pay</Text>
        <Text style={styles.value}>
          ₹{Math.round(adjustedNetPay).toLocaleString()}
        </Text>
      </View>

      {/* Advance */}
      <View style={styles.row}>
        <Text style={styles.label}>Advance Paid ({online}%)</Text>
        <Text style={styles.value}>₹{onlinePay.toFixed(0)}</Text>
      </View>

      {/* Balance */}
      <View style={styles.row}>
        <Text style={styles.label}>Balance Due ({cod}%)</Text>
        <Text style={styles.value}>₹{codPay.toFixed(0)}</Text>
      </View>
    </View>


    {/* Buttons */}
    {selectedPayment === "0% Online and 100% COD" ? (
      <TouchableOpacity
        style={styles.codBtn}
        onPress={handleCreateOrder}
      >
        <Text style={styles.btnText}>CREATE ORDER</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={styles.payBtn}
        onPress={handleOnlinePaymentFlow}
      >
        <Text style={styles.btnText}>PAY NOW</Text>
      </TouchableOpacity>
    )}

    {/* Footer */}
    <Cta />
    <Footer />
    {/* Success Modal */}
    <ModalSuccess
      isOpen={isOrderSuccessOpen}
      onClose={() => setIsOrderSuccessOpen(false)}
    />

    {/* Coupon Modal */}
    <ModalCoupon
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      discount={discountByCoupon}
      discountCode={appliedCoupon?.discountCode}
    />

    {/* Toasts */}
    {toasts.map((toast, idx) => (
      <Toast
        key={toast.id || idx}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToasts((prev) => prev.filter((t) => t.id !== toast.id))
        }
      />
    ))}
  </ScrollView>
  <BottomNav />
  </View>
);
}

export default CheckoutPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { marginBottom: 12 },
  section: { marginVertical: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between" },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  cartItem: { marginVertical: 8, backgroundColor: "#f9f9f9", borderRadius: 8 },
  removeBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
  },
  noItems: { textAlign: "center", marginVertical: 20, fontSize: 16 },
  addAddressBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    borderWidth: 1,
    borderColor: "#6b21a8",
    borderRadius: 6,
  },
  addAddressText: { color: "#6b21a8", marginRight: 6 },
  addressBox: {
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  discountBtn: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
summaryBox: {
  marginVertical: 20,
  padding: 16,
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  backgroundColor: "#fff",
},
row: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 6,
},
rowWithBorder: {
  flexDirection: "row",
  justifyContent: "space-between",
  borderBottomWidth: 1,
  borderBottomColor: "#ddd",
  paddingBottom: 6,
  marginBottom: 6,
},
label: { fontSize: 16, fontWeight: "500" },
subLabel: { fontSize: 14, color: "#666" },
value: { fontSize: 16, fontWeight: "600" },
walletInput: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  padding: 4,
  width: 80,
  textAlign: "right",
  color: "green",
},
errorText: { color: "red", fontSize: 12, marginTop: 4 },

  codBtn: {
    backgroundColor: "#f97316",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  payBtn: {
    backgroundColor: "#6b21a8",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  sidebarOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
},
sidebar: {
  height: "80%",
  backgroundColor: "white",
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  padding: 16,
},
closeBtn: {
  position: "absolute",
  right: 16,
  top: 16,
  zIndex: 10,
},
sidebarTitle: {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 12,
},
input: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  padding: 10,
  marginBottom: 16,
},
discountItem: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
  backgroundColor: "#fff",
},
discountCode: { fontSize: 18, fontWeight: "bold" },
discountSave: { color: "green", marginVertical: 4, fontWeight: "600" },
discountText: { fontSize: 14, color: "#555" },
applyBtn: { color: "#6b21a8", fontWeight: "bold", fontSize: 14 },
notEligible: { color: "#999", fontSize: 12 },
noDiscounts: { textAlign: "center", marginTop: 20, color: "#777" },
});
