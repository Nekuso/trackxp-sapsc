/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import Loading from "./skeleton";
import OrderServiceContent from "./order-service-content";
import createSupabaseBrowserClient from "@/lib/supabase/client";
import { useOrderServices } from "@/hooks/useOrderServices";
import OrderNotFound from "./not-found";
import { toast as sonner } from "sonner";
import { useEmployees } from "@/hooks/useEmployees";
import { useBranches } from "@/hooks/useBranches";
import { useProducts } from "@/hooks/useProducts";
import { useParts } from "@/hooks/useParts";
import { useDispatch, useSelector } from "react-redux";
import { HomeIcon } from "lucide-react";
import { setEmployeesData } from "@/redux/slices/allEmployeesSlice";
import { setBranchesData } from "@/redux/slices/branchesSlice";
import {
  setProductsData,
  setPartsData,
} from "@/redux/slices/orderCartOptionSlice";
import { useRouter } from "next/navigation";
import { ROLES } from "@/lib/actions/roles";
import { useAuthMiddleware } from "@/lib/actions/useMiddleware";
import { useServices } from "@/hooks/useServices";
import { setServicesData } from "@/redux/slices/orderServiceCartOptionSlice";

export default function OrderService({ params }: { params: any }) {
  const router = useRouter();
  const { ADMINISTRATOR, SUPERVISOR, MANAGER, STAFF, CASHIER } = ROLES;
  const currentSession = useSelector((state: any) => state.currentSession);
  const access = useAuthMiddleware(
    [ADMINISTRATOR, SUPERVISOR, MANAGER, STAFF, CASHIER],
    currentSession
  );
  if (!access.allowed) {
    router.push(access.defaultRoute);
    return null;
  }

  const dispatch = useDispatch();
  const { getOrderService, currentOrderServiceData } = useOrderServices();
  const [error, setError] = useState(false);

  const { getEmployees, allEmployeesData } = useEmployees();
  const { getBranches, allBranchesData } = useBranches();
  const { getProducts, productsData } = useProducts();
  const { getParts, partsData } = useParts();
  const { getServices, servicesData } = useServices();

  const branchesData = allBranchesData.map((branch: any) => ({
    id: branch?.id,
    value: branch?.branch_name,
    label: branch?.branch_name,
    icon: HomeIcon,
  }));

  const productsCart = useSelector(
    (state: any) => state.viewOrderCart.productsCart
  );
  const partsCart = useSelector((state: any) => state.viewOrderCart.partsCart);

  dispatch(setEmployeesData(allEmployeesData));

  dispatch(setBranchesData(branchesData));
  dispatch(setProductsData({ productsData, productsCart }));
  dispatch(setPartsData({ partsData, partsCart }));
  dispatch(setServicesData({ servicesData }));

  useEffect(() => {
    const initialFetch = async () => {
      const result = await getOrderService(params.id, 500);
      if (result) setError(result);
    };

    initialFetch();
    getEmployees();
    getBranches();
    getProducts(currentSession);
    getParts(currentSession);
    getServices(currentSession);
  }, []);

  useEffect(() => {
    if (!error) {
      const supabase = createSupabaseBrowserClient();
      const subscribedChannel = supabase
        .channel(`order-service-follow-up-${params.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "order_services",
            filter: `id=eq.${params.id}`,
          },
          (payload: any) => {
            getOrderService(params.id, 0);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "progress_entries",
            filter: `order_service_id=eq.${params.id}`,
          },
          (payload: any) => {
            getOrderService(params.id, 0);
            sonner("📣 Notification", {
              description: `Order has been updated!`,
            });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "image_entries",
            filter: `order_service_id=eq.${params.id}`,
          },
          (payload: any) => {
            getOrderService(params.id, 0);
            sonner("📣 Notification", {
              description: `Order has been updated!`,
            });
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "products" },
          (payload: any) => {
            getProducts(currentSession);
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "parts" },
          (payload: any) => {
            getParts(currentSession);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "purchase_products",
            filter: `order_service_id=eq.${params.id}`,
          },
          (payload: any) => {
            sonner("📣 Notification", {
              description: `Order has been updated!`,
            });
            getOrderService(params.id, 0);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "purchase_parts",
            filter: `order_service_id=eq.${params.id}`,
          },
          (payload: any) => {
            sonner("📣 Notification", {
              description: `Order has been updated!`,
            });
            getOrderService(params.id, 0);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "purchase_services",
            filter: `order_service_id=eq.${params.id}`,
          },
          (payload: any) => {
            sonner("📣 Notification", {
              description: `Order has been updated!`,
            });
            getOrderService(params.id, 0);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscribedChannel);
      };
    }
  }, []);

  return (
    <div className="w-full flex justify-center place-items-center">
      {error ? (
        <OrderNotFound />
      ) : currentOrderServiceData.length === 0 ? (
        <Loading />
      ) : (
        <OrderServiceContent
          params={params}
          orderService={currentOrderServiceData}
        />
      )}
    </div>
  );
}
