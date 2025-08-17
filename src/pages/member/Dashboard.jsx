import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Dumbbell, CalendarDays, Wallet, LineChart, Bell, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import supabase from "../../lib/supabaseClient";

const Dashboard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from DB
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("title, message, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotifications(data);
      }
    };

    fetchNotifications();

    // Optional: Realtime subscription if you want live updates
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const tabs = [
    {
      title: "Schedules",
      icon: <CalendarDays className="w-10 h-10 text-black" />,
      path: "/member/schedules",
    },
    {
      title: "Measurements",
      icon: <LineChart className="w-10 h-10 text-black" />,
      path: "/member/measurements",
    },
    {
      title: "Payments",
      icon: <Wallet className="w-10 h-10 text-black" />,
      path: "/member/payments",
    },
    {
      title: "Exercises",
      icon: <Dumbbell className="w-10 h-10 text-black" />,
      path: "/member/exercises",
    },
    {
      title: "About & Information",
      icon: <Info className="w-10 h-10 text-black" />,
      path: "/member/info",
    },
  ];

  return (
    <div className="p-6 bg-black min-h-screen">
      {/* 🔔 Notifications Banner */}
      {notifications.length > 0 && (
        <div className="w-full bg-yellow-500 text-black py-2 px-4 rounded-lg mb-6 overflow-hidden relative">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 animate-pulse" />
            <div className="overflow-hidden whitespace-nowrap">
              <div className="animate-marquee inline-block">
                {notifications.map((n, idx) => (
                  <span key={idx} className="mx-8">
                    <strong>{n.title}:</strong> {n.message}:-
                    <i>
                      {new Date(n.created_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </i>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Heading */}
      <h1 className="text-2xl font-bold text-yellow-500 mb-6">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tabs.map((tab, idx) => (
          <Card
            key={idx}
            className="cursor-pointer hover:shadow-yellow-500/70 transition transform hover:-translate-y-1 bg-black border border-yellow-500"
            onClick={() => navigate(tab.path)}
          >
            <div className="flex flex-col items-center justify-center text-center text-black">
              {tab.icon}
              <p className="mt-3 text-lg font-semibold">{tab.title}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
