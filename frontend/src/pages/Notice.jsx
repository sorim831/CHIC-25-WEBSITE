import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import Icons from "../components/Icons";
import "../styles/Notice.css";

const Notice = () => {
  const address = process.env.REACT_APP_BACKEND_ADDRESS;

  const [userId, setUserId] = useState(null);
  const [userNickname, setUserNickname] = useState(null);
  const [userStatus, setUserStatus] = useState(null);

  const checkAccessToken = async (
    setUserId,
    setUserNickname,
    setUserStatus
  ) => {
    const token = localStorage.getItem("token");
    //console.log(token);
    if (!token) return; // 토큰이 없으면 검증하지 않음
    else {
      try {
        const response = await fetch(`${address}/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Bearer 형식으로 토큰 전송
          },
        });

        const result = await response.json();
        console.log(result);

        if (result.success) {
          setUserId(result.user.userId);
          setUserNickname(result.user.userNickname);
          setUserStatus(result.user.userStatus);
        }
      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
        localStorage.removeItem("token");
      }
    }
  };
  useEffect(() => {
    checkAccessToken(setUserId, setUserNickname, setUserStatus);
  }, []);

  // 공지 전체 목록
  const [notices, setNotices] = useState([]);
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState("");
  // 검색에 따라 필터링된 목록
  const [filteredNotices, setFilteredNotices] = useState([]);

  useEffect(() => {
    // 예시를 위한 더미 데이터
    const dummyData = [
      {
        id: 1,
        title: "첫 번째 공지사항",
        content: "첫 번째 공지내용입니다.",
        date: "2023-01-01",
      },
      {
        id: 2,
        title: "두 번째 공지사항",
        content: "두 번째 공지내용입니다.",
        date: "2023-01-10",
      },
      {
        id: 3,
        title: "React 공부 모임 안내",
        content: "다음 달부터 매주 월요일에 진행합니다.",
        date: "2023-01-15",
      },
    ];

    setNotices(dummyData);
    setFilteredNotices(dummyData);
  }, []);

  // 2) 검색어가 변할 때마다 목록 필터링
  useEffect(() => {
    const filtered = notices.filter((notice) =>
      notice.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotices(filtered);
  }, [searchQuery, notices]);

  // 검색어 업데이트
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Banner />
      <Icons />
      {/* 공지사항 페이지 내용 */}
      <div className="notice-container">
        <div className="notice-search-bar">
          <input
            type="text"
            placeholder="공지사항 검색"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* 공지 목록 */}
        <ul className="notice-list">
          {filteredNotices.map((notice) => (
            <li key={notice.id} className="notice-item">
              <h3>{notice.title}</h3>
              <p>{notice.content}</p>
              <div className="notice-date">{notice.date}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Notice;
