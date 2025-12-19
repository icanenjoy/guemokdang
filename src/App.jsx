import React, { useState } from 'react'
import styled from 'styled-components'
import CheckForm from './components/CheckForm'
import SalesForm from './components/SalesForm'

const vars = {
    bg: '#f3f6fb',
    card: '#ffffff',
    muted: '#6b7280',
    accent: '#1f6feb',
    radius: '12px',
    pad: '20px',
    gap: '24px',
    maxWidth: '1100px',
}

const AppContainer = styled.div`
    min-height: 100vh;
    background: ${vars.bg};
    display: flex;
    justify-content: center;
    padding: 40px 20px;
    box-sizing: border-box;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR',
        'Helvetica Neue', Arial;
`

const Card = styled.div`
    width: 100%;
    max-width: ${vars.maxWidth};
    background: ${vars.card};
    border-radius: ${vars.radius};
    padding: ${vars.pad};
    box-shadow: 0 8px 30px rgba(17, 24, 39, 0.06);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: ${vars.gap};
`

const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
`

const TitleGroup = styled.div`
    display: flex;
    flex-direction: column;
`

const Title = styled.h1`
    margin: 0;
    font-size: 20px;
    color: #0f172a;
    font-weight: 700;
`

const Subtitle = styled.div`
    font-size: 13px;
    color: ${vars.muted};
`

const TabGroup = styled.div`
    display: flex;
    align-items: center;
    background: transparent;
    overflow: hidden;
    justify-content: space-between;
`

const TabButton = styled.button`
    width: 100%;
    appearance: none;
    border: none;
    background: ${(p) => (p.active ? vars.accent : 'transparent')};
    color: ${(p) => (p.active ? '#fff' : vars.muted)};
    padding: 8px 14px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 600;
    transition:
        background 0.12s ease,
        color 0.12s ease;
    &:first-child {
        border-right: 1px solid ${vars.border};
    }
`

const Content = styled.main`
    display: block;
`

const SalesView = styled.div`
    padding: 8px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const SalesNote = styled.div`
    background: ${vars.bg};
    border: 1px solid ${vars.border};
    padding: 12px;
    border-radius: 8px;
    color: ${vars.muted};
    font-size: 14px;
`

export default function App() {
    const [active, setActive] = useState('feedback') // 'feedback' | 'sales'

    return (
        <AppContainer>
            <Card>
                <TabGroup role="tablist" aria-label="view tabs">
                    <TabButton
                        type="button"
                        active={active === 'feedback'}
                        onClick={() => setActive('feedback')}
                        aria-pressed={active === 'feedback'}>
                        메뉴 피드백
                    </TabButton>
                    <TabButton
                        type="button"
                        active={active === 'sales'}
                        onClick={() => setActive('sales')}
                        aria-pressed={active === 'sales'}>
                        매출
                    </TabButton>
                </TabGroup>

                <Content>
                    {active === 'feedback' ? (
                        <>
                            <Header>
                                <TitleGroup>
                                    <Title>메뉴 피드백</Title>
                                    <Subtitle>
                                        일별 판매/피드백을 기록하세요
                                    </Subtitle>
                                </TitleGroup>
                            </Header>
                            <CheckForm onSubmit={() => {}} />
                        </>
                    ) : (
                        <>
                            <Header>
                                <TitleGroup>
                                    <Title>매출 기록</Title>
                                    <Subtitle>
                                        매출을 입력하세요 기록하세요
                                    </Subtitle>
                                </TitleGroup>
                            </Header>
                            <SalesForm onSubmit={() => {}} />
                        </>
                    )}
                </Content>
            </Card>
        </AppContainer>
    )
}
