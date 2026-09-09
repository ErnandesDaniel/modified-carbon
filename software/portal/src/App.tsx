import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { ConfigProvider, Layout, Menu, theme, Typography } from 'antd'
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CloudServerOutlined,
  ExperimentOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import HomePage from './pages/HomePage'
import SleeveCatalogPage from './pages/SleeveCatalogPage'
import NeedlecastPage from './pages/NeedlecastPage'
import ValidationPage from './pages/ValidationPage'

const { Header, Sider, Content } = Layout
const { Title } = Typography

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: 'Главная' },
  { key: '/catalog', icon: <CloudServerOutlined />, label: 'Каталог Sleeves' },
  { key: '/needlecast', icon: <ExperimentOutlined />, label: 'Needlecast' },
  { key: '/validation', icon: <SafetyCertificateOutlined />, label: 'Валидация' },
]

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const selectedKey = location.pathname === '/' ? '/'
    : location.pathname === '/catalog' ? '/catalog'
    : location.pathname === '/needlecast' ? '/needlecast'
    : location.pathname === '/validation' ? '/validation'
    : '/'

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#722ed1',
          borderRadius: 8,
          colorBgContainer: '#1a1a2e',
          colorBgLayout: '#0f0f1a',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ background: '#16162a' }}
          width={220}
        >
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <Title level={4} style={{ color: '#b37feb', margin: 0, fontSize: collapsed ? 14 : 16 }}>
              {collapsed ? 'S' : 'SCMS'}
            </Title>
            {!collapsed && (
              <div style={{ color: '#666', fontSize: 11 }}>Sleeving Clinic</div>
            )}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ background: 'transparent' }}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: '0 24px',
              background: '#16162a',
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #2a2a4a',
            }}
          >
            {collapsed
              ? <MenuUnfoldOutlined onClick={() => setCollapsed(false)} style={{ fontSize: 18, color: '#b37feb', cursor: 'pointer' }} />
              : <MenuFoldOutlined onClick={() => setCollapsed(true)} style={{ fontSize: 18, color: '#b37feb', cursor: 'pointer' }} />
            }
            <Title level={5} style={{ color: '#e0d4ff', margin: '0 0 0 16px', fontWeight: 400 }}>
              Bay City Sleeving Clinic — 2384
            </Title>
          </Header>
          <Content style={{ margin: 24, overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<SleeveCatalogPage />} />
              <Route path="/needlecast" element={<NeedlecastPage />} />
              <Route path="/validation" element={<ValidationPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
