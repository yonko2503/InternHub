import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, setAuthToken, setStoredUser, getStoredUser, getAuthToken } from '../api/client';
import { INITIAL_USERS, INITIAL_JOBS, INITIAL_APPLICATIONS, INITIAL_NOTIFICATIONS, INITIAL_SKILLS } from '../api/mockData';

const safeGetStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && (Array.isArray(fallback) ? Array.isArray(parsed) : true) ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
};

const safeSetStorage = (key, value) => {
  try {
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.warn(`Could not save ${key} to localStorage:`, e);
  }
};

const repairJobsData = (jobsList) => {
  if (!Array.isArray(jobsList)) return INITIAL_JOBS;
  return jobsList.map((j) => {
    const titleAndComp = `${j.companyName || ''} ${j.title || ''}`.toLowerCase();
    if (titleAndComp.includes('viettel')) {
      return { 
        ...j, 
        companyId: 4, 
        companyName: j.companyName || 'Viettel Solutions', 
        companyLogo: j.companyLogo && !j.companyLogo.includes('fpt') ? j.companyLogo : '/logos/viettel.svg' 
      };
    }
    if (titleAndComp.includes('fpt')) {
      return { 
        ...j, 
        companyId: 2, 
        companyName: j.companyName || 'FPT Software', 
        companyLogo: j.companyLogo && !j.companyLogo.includes('viettel') ? j.companyLogo : '/logos/fpt.svg' 
      };
    }
    if (titleAndComp.includes('techcorp')) {
      return { 
        ...j, 
        companyId: 3, 
        companyName: j.companyName || 'TechCorp Innovation Lab', 
        companyLogo: j.companyLogo && !j.companyLogo.includes('fpt') ? j.companyLogo : '/logos/techcorp.svg' 
      };
    }
    return j;
  });
};

const repairUserProfile = (u) => {
  if (!u) return null;
  const name = `${u.fullName || ''} ${u.username || ''} ${u.email || ''} ${u.companyProfile?.companyName || ''}`.toLowerCase();
  if (name.includes('viettel')) {
    return {
      ...u,
      id: 4,
      companyProfile: {
        ...(u.companyProfile || {}),
        id: 4,
        userId: 4,
        companyName: u.companyProfile?.companyName || 'Viettel Solutions',
      },
    };
  }
  if (name.includes('fpt')) {
    return {
      ...u,
      id: 2,
      companyProfile: {
        ...(u.companyProfile || {}),
        id: 2,
        userId: 2,
        companyName: u.companyProfile?.companyName || 'FPT Software',
      },
    };
  }
  if (name.includes('techcorp')) {
    return {
      ...u,
      id: 3,
      companyProfile: {
        ...(u.companyProfile || {}),
        id: 3,
        userId: 3,
        companyName: u.companyProfile?.companyName || 'TechCorp Innovation Lab',
      },
    };
  }
  return u;
};

const repairUsersData = (usersList) => {
  if (!Array.isArray(usersList)) return INITIAL_USERS;
  const list = usersList.map((u) => repairUserProfile(u));
  // Ensure viettel user exists
  const hasViettel = list.some((u) => u.username === 'viettel_solutions' || u.email === 'hr@viettelsolutions.vn');
  if (!hasViettel) {
    const viettelUser = INITIAL_USERS.find((u) => u.username === 'viettel_solutions') || INITIAL_USERS[3];
    return [...list, viettelUser];
  }
  return list;
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => repairUserProfile(getStoredUser()) || null);
  const [token, setToken] = useState(() => getAuthToken() || null);
  const [jobs, setJobs] = useState(() => repairJobsData(safeGetStorage('internhub_jobs', INITIAL_JOBS)));
  const [applications, setApplications] = useState(() => safeGetStorage('internhub_applications', INITIAL_APPLICATIONS));
  const [notifications, setNotifications] = useState(() => safeGetStorage('internhub_notifications', INITIAL_NOTIFICATIONS));
  const [allUsers, setAllUsers] = useState(() => repairUsersData(safeGetStorage('internhub_all_users', INITIAL_USERS)));
  const [skillsList, setSkillsList] = useState(() => safeGetStorage('internhub_skills', INITIAL_SKILLS));
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    safeSetStorage('internhub_all_users', allUsers);
  }, [allUsers]);

  useEffect(() => {
    safeSetStorage('internhub_jobs', jobs);
  }, [jobs]);

  useEffect(() => {
    safeSetStorage('internhub_applications', applications);
  }, [applications]);

  useEffect(() => {
    safeSetStorage('internhub_notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    safeSetStorage('internhub_skills', skillsList);
  }, [skillsList]);

  const fetchBackendJobs = async () => {
    try {
      const res = await apiRequest('/jobs');
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setJobs(res.data);
        setIsLiveBackend(true);
        safeSetStorage('internhub_jobs', res.data);
        console.log('Connected to live Spring Boot backend & loaded DB jobs!');
      }
    } catch (e) {
      console.log('Using integrated state mode (Spring Boot backend offline or loading)');
    }
  };

  const fetchBackendUsers = async () => {
    try {
      const res = await apiRequest('/admin/users');
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAllUsers(res.data);
        safeSetStorage('internhub_all_users', res.data);
      }
    } catch (e) {
      // Not logged in as admin or offline
    }
  };

  const fetchBackendCompanies = async () => {
    try {
      const res = await apiRequest('/companies');
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAllUsers((prev) => {
          return prev.map((u) => {
            const compMatch = res.data.find(c => c.userId === u.id || c.companyName === u.companyProfile?.companyName || c.companyName === u.fullName);
            if (compMatch) {
              return {
                ...u,
                avatar: compMatch.logoUrl || u.avatar,
                companyProfile: {
                  ...(u.companyProfile || {}),
                  ...compMatch,
                  logoUrl: compMatch.logoUrl || u.companyProfile?.logoUrl
                }
              };
            }
            return u;
          });
        });
      }
    } catch (e) {
      // Backend offline or loading
    }
  };

  const fetchUserData = async (loggedRole) => {
    try {
      if (loggedRole === 'ROLE_STUDENT') {
        const [studRes, appRes] = await Promise.allSettled([
          apiRequest('/students/me'),
          apiRequest('/applications/me')
        ]);
        if (studRes.status === 'fulfilled' && studRes.value?.data) {
          setUser((prev) => prev ? ({ ...prev, studentProfile: studRes.value.data, avatar: studRes.value.data.avatar || prev.avatar }) : prev);
        }
        if (appRes.status === 'fulfilled' && appRes.value?.data && Array.isArray(appRes.value.data)) {
          setApplications(appRes.value.data);
          safeSetStorage('internhub_applications', appRes.value.data);
        }
      } else if (loggedRole === 'ROLE_COMPANY') {
        const [compRes, appRes] = await Promise.allSettled([
          apiRequest('/companies/me'),
          apiRequest('/applications/company')
        ]);
        if (compRes.status === 'fulfilled' && compRes.value?.data) {
          setUser((prev) => prev ? ({ 
            ...prev, 
            companyProfile: compRes.value.data, 
            avatar: compRes.value.data.logoUrl || prev.avatar 
          }) : prev);
        }
        if (appRes.status === 'fulfilled' && appRes.value?.data && Array.isArray(appRes.value.data)) {
          setApplications(appRes.value.data);
          safeSetStorage('internhub_applications', appRes.value.data);
        }
      } else if (loggedRole === 'ROLE_ADMIN') {
        fetchBackendUsers();
      }
    } catch (e) {
      console.warn('Could not load user data from backend:', e.message);
    }
  };

  // Check if live Spring Boot backend is reachable
  useEffect(() => {
    fetchBackendJobs();
    fetchBackendCompanies();
    if (user?.role) {
      fetchUserData(user.role);
    }
  }, [user?.role, token]);

  const login = async (username, password) => {
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      if (res && res.success && res.data) {
        const authData = res.data;
        const loggedUser = {
          id: authData.id,
          username: authData.username,
          email: authData.email,
          fullName: authData.fullName,
          role: authData.role,
          profileId: authData.profileId,
        };
        setUser(loggedUser);
        setToken(authData.accessToken);
        setAuthToken(authData.accessToken);
        setStoredUser(loggedUser);

        // Fetch real profile data and applications from database
        fetchUserData(authData.role);
        fetchBackendJobs();
        return { success: true };
      }
    } catch (err) {
      // Fallback to mock users for offline resiliency
      const found = allUsers.find(
        (u) => (u.username === username || u.email === username)
      );
      if (found) {
        setUser(found);
        setToken('demo-token-' + found.id);
        setAuthToken('demo-token-' + found.id);
        setStoredUser(found);
        return { success: true };
      }
      throw new Error(err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
  };

  const quickLogin = async (roleKey) => {
    let credentials = null;
    if (roleKey === 'student') credentials = { username: 'student_uet', password: '123456' };
    else if (roleKey === 'student2') credentials = { username: 'student2', password: '123456' };
    else if (roleKey === 'fpt' || roleKey === 'company') credentials = { username: 'fpt_software', password: '123456' };
    else if (roleKey === 'viettel') credentials = { username: 'viettel_solutions', password: '123456' };
    else if (roleKey === 'techcorp') credentials = { username: 'techcorp', password: '123456' };
    else if (roleKey === 'admin') credentials = { username: 'admin', password: 'admin123' };

    if (credentials) {
      try {
        await login(credentials.username, credentials.password);
      } catch (err) {
        let target = allUsers.find((u) => u.username === credentials.username) || INITIAL_USERS[0];
        setUser(target);
        setToken('demo-token-' + target.id);
        setAuthToken('demo-token-' + target.id);
        setStoredUser(target);
      }
    }
  };

  const register = async (regData) => {
    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(regData),
      });
      if (res.success && res.data) {
        const authData = res.data;
        const newUser = {
          id: authData.id,
          username: authData.username,
          email: authData.email,
          fullName: authData.fullName,
          role: authData.role,
          profileId: authData.profileId,
        };
        setUser(newUser);
        setToken(authData.accessToken);
        setAuthToken(authData.accessToken);
        setStoredUser(newUser);
        return { success: true };
      }
    } catch (err) {
      // Fallback: create mock user
      const newId = Date.now();
      const mockNewUser = {
        id: newId,
        username: regData.username,
        email: regData.email,
        fullName: regData.fullName,
        role: regData.role,
        phone: regData.phone || '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
        isActive: true,
        ...(regData.role === 'ROLE_STUDENT'
          ? {
              studentProfile: {
                id: newId,
                studentCode: regData.studentCode || '21029999',
                university: regData.university || 'Đại học Công nghệ - ĐHQGHN (UET)',
                major: regData.major || 'Công nghệ Thông tin',
                gpa: 3.5,
                graduationYear: 2025,
                bio: 'Sinh viên năng động, nhiệt huyết.',
                resumeUrl: 'https://internhub.uet.edu.vn/cv/sample-cv.pdf',
                skills: ['Java', 'ReactJS', 'MySQL'],
              },
            }
          : {
              companyProfile: {
                id: newId,
                companyName: regData.companyName || regData.fullName,
                logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&h=200&q=80',
                address: regData.address || 'Hà Nội',
                website: regData.website || 'https://company.vn',
                industry: regData.industry || 'Công nghệ thông tin',
                scale: '50-100 nhân viên',
                description: 'Công ty công nghệ phát triển bền vững.',
                isVerified: true,
              },
            }),
      };
      setAllUsers((prev) => [...prev, mockNewUser]);
      setUser(mockNewUser);
      setToken('demo-token-' + newId);
      setAuthToken('demo-token-' + newId);
      setStoredUser(mockNewUser);
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    setStoredUser(null);
  };

  // Applications
  const applyForJob = async (jobId, coverLetter, resumeUrl) => {
    // Prevent duplicate application
    const isAlreadyApplied = applications.some(
      (a) => a.jobId === Number(jobId) && (a.studentUserId === user?.id || (user?.email && a.studentEmail === user?.email))
    );
    if (isAlreadyApplied) {
      throw new Error('Bạn đã nộp hồ sơ ứng tuyển vào vị trí này rồi! Vui lòng không nộp trùng.');
    }

    try {
      const res = await apiRequest('/applications', {
        method: 'POST',
        body: JSON.stringify({ jobId: Number(jobId), coverLetter, resumeUrl }),
      });
      if (res && res.success && res.data) {
        setApplications((prev) => [res.data, ...prev]);
        safeSetStorage('internhub_applications', [res.data, ...applications]);
        fetchUserData('ROLE_STUDENT');
        return res.data;
      }
    } catch (e) {
      if (e.message && e.message.includes('nộp đơn ứng tuyển')) {
        throw e;
      }
      // Local fallback
      const job = jobs.find((j) => j.id === Number(jobId));
      const newApp = {
        id: Date.now(),
        jobId: Number(jobId),
        jobTitle: job?.title || 'Vị trí thực tập',
        companyName: job?.companyName || 'Doanh nghiệp',
        companyLogo: job?.companyLogo,
        studentProfileId: user?.studentProfile?.id || user?.id,
        studentUserId: user?.id,
        studentName: user?.fullName || 'Sinh viên',
        studentEmail: user?.email,
        studentPhone: user?.phone || '0912345678',
        studentUniversity: user?.studentProfile?.university || 'UET - ĐHQGHN',
        studentMajor: user?.studentProfile?.major || 'CNTT',
        studentGpa: user?.studentProfile?.gpa || 3.6,
        studentSkills: user?.studentProfile?.skills || ['Java', 'ReactJS'],
        resumeUrl: resumeUrl || user?.studentProfile?.resumeUrl || 'https://internhub.uet.edu.vn/cv/sample.pdf',
        coverLetter: coverLetter || '',
        status: 'APPLIED',
        employerFeedback: null,
        interviewTime: null,
        interviewLocation: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setApplications((prev) => [newApp, ...prev]);
      return newApp;
    }
  };

  const updateApplicationStatus = async (appId, status, feedback, interviewData) => {
    try {
      const res = await apiRequest(`/applications/${appId}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status,
          employerFeedback: feedback,
          interviewTime: interviewData?.time,
          interviewLocation: interviewData?.location,
          interviewNotes: interviewData?.notes,
        }),
      });
      if (res && res.success && res.data) {
        setApplications((prev) => prev.map((a) => (a.id === appId ? res.data : a)));
        fetchUserData('ROLE_COMPANY');
        return res.data;
      }
    } catch (e) {
      // Local fallback
      setApplications((prev) =>
        prev.map((a) => {
          if (a.id === appId) {
            return {
              ...a,
              status,
              employerFeedback: feedback || a.employerFeedback,
              interviewTime: interviewData?.time || a.interviewTime,
              interviewLocation: interviewData?.location || a.interviewLocation,
              interviewNotes: interviewData?.notes || a.interviewNotes,
              updatedAt: new Date().toISOString(),
            };
          }
          return a;
        })
      );
    }
  };

  // Jobs
  const createJob = async (jobData) => {
    const compName = user?.companyProfile?.companyName || user?.fullName || 'Doanh nghiệp';
    const compLogo = user?.avatar || user?.companyProfile?.logoUrl || '/logos/default-company.svg';
    const compAddr = jobData.location || user?.companyProfile?.address || 'Hà Nội';
    const compWeb = user?.companyProfile?.website || 'https://internhub.edu.vn';

    const localNewJob = {
      id: Date.now(),
      companyId: user?.id || user?.companyProfile?.id || 2,
      companyName: compName,
      companyLogo: compLogo,
      companyAddress: compAddr,
      companyWebsite: compWeb,
      title: jobData.title,
      description: jobData.description,
      requirements: jobData.requirements,
      benefits: jobData.benefits || 'Môi trường làm việc năng động, cơ hội lên chính thức.',
      location: jobData.location || compAddr,
      jobType: jobData.jobType || 'INTERNSHIP',
      salaryRange: jobData.salaryRange || 'Thỏa thuận',
      slots: Number(jobData.slots) || 2,
      deadline: jobData.deadline || '2026-12-31',
      status: 'ACTIVE',
      skills: jobData.skills || ['Java', 'Spring Boot'],
      createdAt: new Date().toISOString(),
      applicationsCount: 0,
    };

    try {
      const res = await apiRequest('/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData),
      });
      if (res && res.success && res.data) {
        setJobs((prev) => [res.data, ...prev]);
        fetchBackendJobs();
        return res.data;
      }
    } catch (e) {
      // Local fallback
    }

    setJobs((prev) => {
      const next = [localNewJob, ...prev];
      safeSetStorage('internhub_jobs', next);
      return next;
    });
    return localNewJob;
  };

  const updateJob = async (jobId, jobData) => {
    try {
      const res = await apiRequest(`/jobs/${jobId}`, {
        method: 'PUT',
        body: JSON.stringify(jobData),
      });
      if (res && res.success && res.data) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? res.data : j)));
        fetchBackendJobs();
        return res.data;
      }
    } catch (e) {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, ...jobData } : j))
      );
    }
  };

  const updateJobStatus = async (jobId, status) => {
    try {
      const job = jobs.find((j) => j.id === jobId);
      if (job) {
        const res = await apiRequest(`/jobs/${jobId}`, {
          method: 'PUT',
          body: JSON.stringify({ ...job, status }),
        });
        if (res && res.success && res.data) {
          setJobs((prev) => prev.map((j) => (j.id === jobId ? res.data : j)));
          fetchBackendJobs();
          return res.data;
        }
      }
    } catch (e) {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status } : j))
      );
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await apiRequest(`/jobs/${jobId}`, { method: 'DELETE' });
      fetchBackendJobs();
    } catch (e) {
      // fallback
    }
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    setApplications((prev) => prev.filter((a) => a.jobId !== jobId));
  };

  const addSkill = (newSkill) => {
    if (newSkill && !skillsList.includes(newSkill)) {
      setSkillsList((prev) => [...prev, newSkill]);
    }
  };

  const deleteSkill = (skillToDelete) => {
    setSkillsList((prev) => prev.filter((s) => s !== skillToDelete));
  };

  const sendBroadcastNotification = (title, message) => {
    const newNotifs = allUsers.map((u, idx) => ({
      id: Date.now() + idx,
      userId: u.id,
      title,
      message,
      link: '/jobs',
      isRead: false,
      createdAt: new Date().toISOString(),
    }));
    setNotifications((prev) => [...newNotifs, ...prev]);
  };

  const updateProfile = async (updatedProfileData) => {
    let nextUser = null;
    const newAvatar = updatedProfileData.avatar || updatedProfileData.logoUrl;

    setUser((prev) => {
      if (!prev) return prev;
      nextUser = { 
        ...prev, 
        ...updatedProfileData,
        ...(newAvatar ? { avatar: newAvatar } : {})
      };
      if (prev.role === 'ROLE_STUDENT') {
        nextUser.studentProfile = { ...prev.studentProfile, ...updatedProfileData };
      } else if (prev.role === 'ROLE_COMPANY') {
        nextUser.companyProfile = { 
          ...prev.companyProfile, 
          ...updatedProfileData,
          ...(newAvatar ? { logoUrl: newAvatar } : {})
        };
      }
      setStoredUser(nextUser);
      return nextUser;
    });

    // Synchronize allUsers
    setAllUsers((prev) => {
      const nextList = prev.map((u) => {
        if (u.id === user?.id || (user?.email && u.email === user?.email)) {
          let updated = { 
            ...u, 
            ...updatedProfileData,
            ...(newAvatar ? { avatar: newAvatar } : {})
          };
          if (u.role === 'ROLE_COMPANY') {
            updated.companyProfile = { 
              ...u.companyProfile, 
              ...updatedProfileData,
              ...(newAvatar ? { logoUrl: newAvatar } : {})
            };
          } else if (u.role === 'ROLE_STUDENT') {
            updated.studentProfile = { ...u.studentProfile, ...updatedProfileData };
          }
          return updated;
        }
        return u;
      });
      safeSetStorage('internhub_all_users', nextList);
      return nextList;
    });

    // If company, synchronize all jobs created by this company
    if (user?.role === 'ROLE_COMPANY') {
      const compId = user?.companyProfile?.id || user?.id;
      const compName = updatedProfileData.companyName || user?.companyProfile?.companyName;
      const newLogo = newAvatar || user?.companyProfile?.logoUrl;

      setJobs((prev) => {
        const nextJobs = prev.map((j) => {
          if (j.companyId === compId || j.companyName === user?.companyProfile?.companyName || j.companyName === compName) {
            return {
              ...j,
              ...(compName ? { companyName: compName } : {}),
              ...(newLogo ? { companyLogo: newLogo } : {}),
              ...(updatedProfileData.address ? { companyAddress: updatedProfileData.address } : {}),
              ...(updatedProfileData.website ? { companyWebsite: updatedProfileData.website } : {}),
            };
          }
          return j;
        });
        safeSetStorage('internhub_jobs', nextJobs);
        return nextJobs;
      });
    }

    // Persist changes to MySQL Database via Spring Boot Backend API
    try {
      if (user?.role === 'ROLE_COMPANY') {
        await apiRequest('/companies/me', {
          method: 'PUT',
          body: JSON.stringify({
            fullName: updatedProfileData.fullName,
            phone: updatedProfileData.phone,
            companyName: updatedProfileData.companyName,
            logoUrl: newAvatar,
            website: updatedProfileData.website,
            address: updatedProfileData.address,
            industry: updatedProfileData.industry,
            scale: updatedProfileData.scale,
            foundedYear: updatedProfileData.foundedYear,
            description: updatedProfileData.description,
          }),
        });
        fetchBackendJobs();
      } else if (user?.role === 'ROLE_STUDENT') {
        await apiRequest('/students/me', {
          method: 'PUT',
          body: JSON.stringify(updatedProfileData),
        });
      }
    } catch (err) {
      console.warn('Could not sync profile to backend server:', err.message);
    }
  };

  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleUserStatus = (userId) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const adminUpdateUser = async (userId, updatedData) => {
    let nextUserForCurrent = null;

    setAllUsers((prev) => {
      const nextList = prev.map((u) => {
        if (u.id === userId) {
          const newRole = updatedData.role || u.role;
          const newAvatar = updatedData.avatar || updatedData.logoUrl || u.avatar;
          
          let updated = {
            ...u,
            fullName: updatedData.fullName ?? u.fullName,
            email: updatedData.email ?? u.email,
            phone: updatedData.phone ?? u.phone,
            avatar: newAvatar,
            role: newRole,
            isActive: updatedData.isActive !== undefined ? updatedData.isActive : u.isActive,
          };

          if (newRole === 'ROLE_STUDENT') {
            updated.studentProfile = {
              ...(u.studentProfile || {}),
              studentCode: updatedData.studentCode ?? u.studentProfile?.studentCode,
              university: updatedData.university ?? u.studentProfile?.university,
              major: updatedData.major ?? u.studentProfile?.major,
              gpa: updatedData.gpa !== undefined ? updatedData.gpa : u.studentProfile?.gpa,
              graduationYear: updatedData.graduationYear ?? u.studentProfile?.graduationYear,
              resumeUrl: updatedData.resumeUrl ?? u.studentProfile?.resumeUrl,
            };
          } else if (newRole === 'ROLE_COMPANY') {
            const compName = updatedData.companyName ?? u.companyProfile?.companyName ?? u.fullName;
            updated.companyProfile = {
              ...(u.companyProfile || {}),
              companyName: compName,
              logoUrl: newAvatar,
              website: updatedData.website ?? u.companyProfile?.website,
              industry: updatedData.industry ?? u.companyProfile?.industry,
              scale: updatedData.scale ?? u.companyProfile?.scale,
              address: updatedData.address ?? u.companyProfile?.address,
              description: updatedData.description ?? u.companyProfile?.description,
            };
          }

          if (user && user.id === userId) {
            nextUserForCurrent = { ...user, ...updated };
          }
          return updated;
        }
        return u;
      });

      safeSetStorage('internhub_all_users', nextList);
      return nextList;
    });

    // If current logged-in user is updated
    if (nextUserForCurrent) {
      setUser(nextUserForCurrent);
      setStoredUser(nextUserForCurrent);
    }

    // Sync company jobs & applications if company was edited
    const oldUser = allUsers.find((u) => u.id === userId);
    const compName = updatedData.companyName || updatedData.companyProfile?.companyName || oldUser?.companyProfile?.companyName;
    const compLogo = updatedData.avatar || updatedData.logoUrl;
    const compAddress = updatedData.address || updatedData.companyProfile?.address;
    const compWebsite = updatedData.website || updatedData.companyProfile?.website;

    if (compLogo || compName || compAddress || compWebsite) {
      const matchComp = (itemCompId, itemCompName) => {
        if (itemCompId === userId || itemCompId === oldUser?.companyProfile?.id) return true;
        const jName = (itemCompName || '').toLowerCase().trim();
        const namesToCheck = [
          oldUser?.fullName,
          oldUser?.companyProfile?.companyName,
          oldUser?.username,
          compName,
          updatedData?.fullName
        ].filter(Boolean).map((s) => s.toLowerCase().trim());

        for (const n of namesToCheck) {
          if (jName === n || (n.length >= 3 && (jName.includes(n) || n.includes(jName)))) return true;
        }
        return false;
      };

      setJobs((prev) => {
        const nextJobs = prev.map((j) => {
          if (matchComp(j.companyId, j.companyName)) {
            return {
              ...j,
              ...(compName ? { companyName: compName } : {}),
              ...(compLogo ? { companyLogo: compLogo } : {}),
              ...(compAddress ? { companyAddress: compAddress } : {}),
              ...(compWebsite ? { companyWebsite: compWebsite } : {}),
            };
          }
          return j;
        });
        safeSetStorage('internhub_jobs', nextJobs);
        return nextJobs;
      });

      setApplications((prev) => {
        const nextApps = prev.map((a) => {
          if (matchComp(a.companyId, a.companyName)) {
            return {
              ...a,
              ...(compName ? { companyName: compName } : {}),
              ...(compLogo ? { companyLogo: compLogo } : {}),
            };
          }
          return a;
        });
        safeSetStorage('internhub_applications', nextApps);
        return nextApps;
      });
    }

    try {
      await apiRequest(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });
      fetchBackendUsers();
      fetchBackendJobs();
    } catch (err) {
      console.warn('Could not sync admin user update to backend server:', err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        isLoggedIn: !!user,
        jobs,
        applications,
        notifications,
        allUsers,
        isLiveBackend,
        login,
        register,
        logout,
        quickLogin,
        applyForJob,
        updateApplicationStatus,
        createJob,
        updateJob,
        updateJobStatus,
        deleteJob,
        skillsList,
        addSkill,
        deleteSkill,
        sendBroadcastNotification,
        updateProfile,
        markNotificationRead,
        markAllNotificationsRead,
        toggleUserStatus,
        adminUpdateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
