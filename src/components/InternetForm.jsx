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
    // grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
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
    background: ${(props) => (props.$active ? vars.accent : vars.bg)};
    padding: 8px 16px;
    width: 50%;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
    color: ${(props) => (props.$active ? vars.card : vars.accent)};
    border-radius: 100px;

    &:active {
        transform: translateY(1px);
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

export default function InternetForm({ onSubmit }) {
    const previewRef = useRef(null)
    const [form, setForm] = useState({
        internetContent: '',
    })

    const [submitted, setSubmitted] = useState(null)

    // 복사 상태
    const [copied, setCopied] = useState(false)
    const [type, setType] = useState(true)

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const formatReport = (f) => {
        const lines = []
        lines.push('[서초점 인터넷 발주]\n')
        lines.push(`${f.internetContent}\n`)
        lines.push(`${type ? '요청드립니다.' : '입고되었습니다.'}`)
        return lines.join('\n')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const payload = { ...form }
        const report = formatReport(payload)
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
                <Button onClick={() => setType(!type)} $active={type}>
                    {type ? '요청드립니다' : '입고되었습니다'}
                </Button>
                <Fields>
                    <Field key="internetContent">
                        <FeedbackLabel>
                            <Textarea
                                name="internetContent"
                                value={form.internetContent}
                                onChange={handleChange}
                            />
                        </FeedbackLabel>
                    </Field>
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
