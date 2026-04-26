// Author: Telvin Crasta | CC BY-NC 4.0
import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const BASE_URL = 'http://localhost:8000';
const WS_BASE_URL = 'ws://localhost:8000/ws';

const SAMPLE_CODE = `import sqlite3
import os

def get_user(username, password):
    # Connect to database
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # WARNING: SQL injection vulnerability!
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    cursor.execute(query)
    user = cursor.fetchone()
    
    # Hardcoded secret key
    SECRET_KEY = "mypassword123"
    
    # Inefficient loop
    results = []
    all_users = cursor.execute("SELECT * FROM users").fetchall()
    for u in all_users:
        if u[0] == username:
            results.append(u)
    
    conn.close()
    return user

def process_file(filename):
    # Path traversal vulnerability
    with open("/var/data/" + filename) as f:
        data = f.read()
    return data`;

export default function useReview() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [result, setResult] = useState(null);
  const [wsLog, setWsLog] = useState([]);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [scanning, setScanning] = useState(false);
  
  // Unique client ID for this session
  const clientId = useRef(uuidv4()).current;
  const ws = useRef(null);

  useEffect(() => {
    // We only open the websocket when reviewing starts to keep it clean, 
    // or we can open it once. Let's open it once.
    const socket = new WebSocket(`${WS_BASE_URL}/${clientId}`);
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setWsLog(prev => [...prev, data]);
      } catch (err) {
        console.error("WS Parse Error", err);
      }
    };

    socket.onerror = (err) => {
        console.error("WS Error", err);
    };

    ws.current = socket;
    return () => socket.close();
  }, [clientId]);

  const runReview = useCallback(async () => {
    if (!code.trim() || reviewing) return;

    setReviewing(true);
    setScanning(true);
    setError('');
    setResult(null);
    setWsLog([{ message: "Establishing secure connection..." }]);

    try {
      const response = await axios.post(`${BASE_URL}/review/${clientId}`, {
        code,
        language
      }, { timeout: 120000 });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Review failed. Is the backend running?');
    } finally {
      setReviewing(false);
      setScanning(false);
    }
  }, [code, language, reviewing, clientId]);

  const filteredIssues = result?.issues?.filter(issue => {
    if (activeFilter === 'all') return true;
    return issue.severity === activeFilter || issue.category === activeFilter;
  }) || [];

  return {
    code, setCode, language, setLanguage,
    reviewing, scanning, result, wsLog, error,
    activeFilter, setActiveFilter,
    filteredIssues, runReview
  };
}
