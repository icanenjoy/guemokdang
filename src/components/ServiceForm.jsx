import { useState, useRef } from 'react'
import styled from 'styled-components'

const vars = {
    bg: '#f8f9fb',
    card: '#ffffff',
    muted: '#6b7280',
    border: '#e6e9ef',
    accent: '#1f6feb',
    radius: '8px',
    pad: '16px',
}

const Container = styled.div`
    display: flex;
    gap: 24px;
    align-items: flex-start;

    box-sizing: border-box;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR',
        'Helvetica Neue', Arial;

    /* 모바일: 세로 스택 (폼 위, 결과 아래) */
    @media (max-width: 900px) {
        flex-direction: column;
    }
`

const FormWrapper = styled.form`
    flex: 1;
    min-width: 320px;
    max-width: 720px;
    background: transparent;
`

const Fields = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 10px;
    margin-bottom: 12px;
`

const Field = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    box-sizing: border-box;
`

const FeedbackLabel = styled.label`
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* 제목 왼쪽, 입력 오른쪽으로 정렬 */
    gap: 11px;
    width: 100%;
`

/* 추가: 입력 + 스테퍼 그룹 스타일 */
const InputGroup = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
`

const Stepper = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 6px;
    overflow: hidden;
    background: transparent;
    border: 1px solid ${vars.border};
    height: 38px;
    box-sizing: border-box;
`

const Button = styled.div`
    border: none;
    background: ${(props) => (props.$action ? vars.accent : vars.bg)};
    padding: 8px 20px;
    width: 50%;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
    white-space: nowrap;
    color: ${(props) => (props.$action ? vars.card : vars.muted)};
    border-radius: 100px;

    &:active {
        transform: translateY(1px);
    }

    @media (max-width: 600px) {
        width: 36px;
    }
`

const Preview = styled.aside`
    flex: 1;
    min-width: 300px;
    max-width: 520px;
    background: ${vars.bg};
    border-left: 1px solid ${vars.border};
    padding: ${vars.pad};
    border-radius: 6px;
    box-sizing: border-box;

    /* 모바일에서 결과가 폼 아래로 내려오도록 스타일 조정 */
    @media (max-width: 900px) {
        border-left: none;
        border-top: 1px solid ${vars.border};
        margin-top: 12px;
        max-width: 100%;
    }
`

const PreviewTitle = styled.div`
    font-weight: 700;
    margin-bottom: 8px;
`

const SubmittedTime = styled.div`
    font-size: 12px;
    color: ${vars.muted};
    margin-bottom: 12px;
`

const Pre = styled.pre`
    background: ${vars.card};
    padding: 12px;
    border-radius: 6px;
    border: 1px solid ${vars.border};
    font-family:
        ui-monospace, SFMono-Regular, Menlo, Monaco, 'Noto Sans Mono', monospace;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 13px;
    color: #111827;
    margin: 0;
`

// 추가: 제출 내용 복사 버튼 스타일
const CopyButton = styled.button`
    margin-left: 8px;
    padding: 6px 10px;
    font-size: 13px;
    background: transparent;
    border: 1px solid ${vars.border};
    color: ${vars.muted};
    border-radius: 6px;
    cursor: pointer;
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`
const TextInput = styled.input.attrs({ type: 'text' })`
    width: 100%;
    height: 40px;
    padding: 8px 10px;
    border: 1px solid ${vars.border};
    border-radius: 6px;
    font-size: 14px;
    color: #111827;
    background: ${vars.card};
    outline: none;
    box-sizing: border-box;
    &:focus {
        border-color: rgba(31, 111, 235, 0.18);
        box-shadow: 0 6px 18px rgba(31, 111, 235, 0.06);
    }
`
const FixedSubmit = styled.button`
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    z-index: 1000;
    background: ${vars.accent};
    color: #fff;
    border: none;
    padding: 10px 18px;
    border-radius: 999px;
    box-shadow: 0 8px 30px rgba(31, 111, 235, 0.18);
    cursor: pointer;
    font-weight: 600;
    transition:
        transform 0.12s ease,
        box-shadow 0.12s ease,
        opacity 0.12s ease;

    /* hover 가능한 입력장치에서만 hover/active 적용 (데스크탑 전용) */
    @media (hover: hover) and (pointer: fine) {
        &:hover {
            transform: translateX(-50%) translateY(-3px);
            box-shadow: 0 12px 36px rgba(31, 111, 235, 0.22);
        }
        &:active {
            transform: translateX(-50%) translateY(0);
            opacity: 0.95;
        }
    }

    /* 모바일에서 버튼을 화면 폭에 맞게, 변형 제거하여 '도망' 현상 방지 */
    @media (max-width: 600px) {
        left: 16px;
        right: 16px;
        transform: none !important;
        width: calc(100% - 32px);
        bottom: 16px;
        border-radius: 12px;
    }
`
const Label = styled.label`
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* 제목 왼쪽, 입력 오른쪽으로 정렬 */
    gap: 11px;
    width: 100%;
`

const Title = styled.div`
    font-size: 15px;
    color: #111827;
    font-weight: 600;
    display: flex;
    align-items: center;
    flex: 1; /* 왼쪽 끝에 붙게 차지 */
    text-align: left;
`
const Textarea = styled.textarea`
    width: 100%;
    min-height: 88px;
    padding: 10px;
    border: 1px solid ${vars.border};
    border-radius: 6px;
    resize: vertical;
    font-size: 14px;
    color: #111827;
    background: ${vars.card};
    outline: none;
    box-sizing: border-box;
    &:focus {
        border-color: rgba(31, 111, 235, 0.18);
        box-shadow: 0 6px 18px rgba(31, 111, 235, 0.06);
    }
`
const LABEL_MAP = {
    redBean: '팥',
    fineBean: '고운앙금',
    wholeBean: '통팥',
    chestnut: '밤',
    walnut: '호두',
    nutMix: '견과',
    redDate: '대추',
    ssanghwa: '쌍화',
    raspberry: '라즈베리',
    milkTea: '밀크티',
    driedPersimmon: '상주곶감',
    jeju: '제주녹차',
    matcha: '보성말차',
    whiteBean: '백앙금',
    blackSesame: '흑임자',
    sweetPotato: '고구마',
    pumpkin: '단호박',
}

export default function ServiceForm({ onSubmit }) {
    const previewRef = useRef(null)
    const [form, setForm] = useState({
        redBean: false, // 팥
        fineBean: false, // 고운앙금
        wholeBean: false, // 통팥
        chestnut: false, // 밤
        walnut: false, // 호두
        nutMix: false, // 견과
        redDate: false, // 대추
        ssanghwa: false, // 쌍화
        raspberry: false, // 라즈베리
        milkTea: false, // 밀크티
        driedPersimmon: false, // 상주곶감
        jeju: false, // 제주녹차
        matcha: false, // 보성말차
        whiteBean: false, // 백앙금
        blackSesame: false, // 흑임자
        sweetPotato: false, // 고구마
        pumpkin: false, // 단호박
    })

    const [submitted, setSubmitted] = useState(null)

    // 복사 상태
    const [copied, setCopied] = useState(false)
    const [type, setType] = useState(true)

    const handleChange = (name) => {
        setForm((prev) => ({ ...prev, [name]: !prev[name] }))
    }

    const formatReport = (titleDate, f) => {
        const selected = Object.entries(f)
            .filter(([_, value]) => value === true)
            .map(([k]) => LABEL_MAP[k])

        const lines = []
        lines.push(
            titleDate +
                ' 소비기한 임박 양갱으로 시식 서비스 진행 중입니다' +
                `(${selected.filter(Boolean).join('/')})`
        )
        return lines.join('\n')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const payload = { ...form }
        const today = new Date()
        const titleDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')} 서초점 ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`
        const report = formatReport(titleDate, payload)

        setSubmitted(report)

        // 모바일(<=900px)에서 제출 시 결과 영역으로 스무스 스크롤
        if (
            typeof window !== 'undefined' &&
            window.innerWidth <= 900 &&
            previewRef.current
        ) {
            previewRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }

        if (onSubmit && typeof onSubmit === 'function') onSubmit(payload)
        else console.log('폼 제출:', payload)
    }

    const copySubmitted = async () => {
        if (!submitted) return
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(submitted)
            } else {
                // fallback
                const ta = document.createElement('textarea')
                ta.value = submitted
                document.body.appendChild(ta)
                ta.select()
                document.execCommand('copy')
                document.body.removeChild(ta)
            }
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('복사 실패', err)
        }
    }

    return (
        <Container>
            <FormWrapper onSubmit={handleSubmit} noValidate>
                <Fields>
                    <Button
                        onClick={() => handleChange('redBean')}
                        $action={form.redBean}>
                        팥
                    </Button>
                    <Button
                        $action={form.fineBean}
                        onClick={() => handleChange('fineBean')}>
                        고운앙금
                    </Button>
                    <Button
                        $action={form.wholeBean}
                        onClick={() => handleChange('wholeBean')}>
                        통팥
                    </Button>
                    <Button
                        $action={form.chestnut}
                        onClick={() => handleChange('chestnut')}>
                        밤
                    </Button>
                    <Button
                        $action={form.walnut}
                        onClick={() => handleChange('walnut')}>
                        호두
                    </Button>
                    <Button
                        $action={form.nutMix}
                        onClick={() => handleChange('nutMix')}>
                        견과
                    </Button>
                    <Button
                        $action={form.redDate}
                        onClick={() => handleChange('redDate')}>
                        대추
                    </Button>
                    <Button
                        $action={form.ssanghwa}
                        onClick={() => handleChange('ssanghwa')}>
                        쌍화
                    </Button>
                    <Button
                        $action={form.raspberry}
                        onClick={() => handleChange('raspberry')}>
                        라즈베리
                    </Button>
                    <Button
                        $action={form.milkTea}
                        onClick={() => handleChange('milkTea')}>
                        밀크티
                    </Button>
                    <Button
                        $action={form.driedPersimmon}
                        onClick={() => handleChange('driedPersimmon')}>
                        상주곶감
                    </Button>
                    <Button
                        $action={form.jeju}
                        onClick={() => handleChange('jeju')}>
                        제주녹차
                    </Button>
                    <Button
                        $action={form.matcha}
                        onClick={() => handleChange('matcha')}>
                        보성말차
                    </Button>
                    <Button
                        $action={form.whiteBean}
                        onClick={() => handleChange('whiteBean')}>
                        백앙금
                    </Button>
                    <Button
                        $action={form.blackSesame}
                        onClick={() => handleChange('blackSesame')}>
                        흑임자
                    </Button>
                    <Button
                        $action={form.sweetPotato}
                        onClick={() => handleChange('sweetPotato')}>
                        고구마
                    </Button>
                    <Button
                        $action={form.pumpkin}
                        onClick={() => handleChange('pumpkin')}>
                        단호박
                    </Button>
                </Fields>
            </FormWrapper>

            <Preview ref={previewRef}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 8,
                    }}>
                    <PreviewTitle>제출 결과</PreviewTitle>
                    <CopyButton onClick={copySubmitted} disabled={!submitted}>
                        {copied ? '복사됨' : '복사'}
                    </CopyButton>
                </div>

                {submitted ? (
                    <>
                        <Pre>{submitted}</Pre>
                    </>
                ) : (
                    <SubmittedTime style={{ color: vars.muted }}>
                        아직 제출된 데이터가 없습니다.
                    </SubmittedTime>
                )}
            </Preview>

            <FixedSubmit type="button" onClick={handleSubmit}>
                제출
            </FixedSubmit>
        </Container>
    )
}
