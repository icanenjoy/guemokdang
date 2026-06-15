import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { vars } from '../style'
import Preview from '../components/Preview'

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
    background: ${vars.accent};
    padding: 8px 16px;
    width: 50%;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
    color: #ffffffff;
    border-radius: 100px;

    &:active {
        transform: translateY(1px);
    }

    @media (max-width: 600px) {
        width: 36px;
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
    font-size: 16px;
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
    font-size: 16px;
    color: #111827;
    background: ${vars.card};
    outline: none;
    box-sizing: border-box;
    &:focus {
        border-color: rgba(31, 111, 235, 0.18);
        box-shadow: 0 6px 18px rgba(31, 111, 235, 0.06);
    }
`
const STORAGE_KEY = 'porridgeForm:v1'

const initialForm = {
    patjuk: '',
    sweetPatjuk: '',
    sweetPumkin: '',
    bingsuPat: '',
    bingsuTteok: '',
    coffee: '',
}

export default function PorridgeForm({ onSubmit }) {
    const previewRef = useRef(null)
    const saveTimer = useRef(null)
    const [form, setForm] = useState({
        patjuk: '',
        sweetPatjuk: '',
        sweetPumkin: '',
        bingsuPat: '',
        bingsuTteok: '',
        coffee: '',
        addContent: '',
    })

    const [submitted, setSubmitted] = useState(null)

    // 복사 상태
    const [copied, setCopied] = useState(false)
    const [type, setType] = useState(true)

    // load saved
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) setForm((prev) => ({ ...prev, ...JSON.parse(raw) }))
        } catch (err) {
            console.error('저장 불러오기 실패', err)
        }
    }, [])

    // auto-save (debounced)
    useEffect(() => {
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
            } catch (err) {
                console.error('저장 실패', err)
            }
        }, 500)
        return () => {
            if (saveTimer.current) clearTimeout(saveTimer.current)
        }
    }, [form])

    const clearSaved = () => {
        localStorage.removeItem(STORAGE_KEY)
        setForm(initialForm)
        setSubmitted(null)
        setCopied(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const formatReport = (f) => {
        const lines = []
        lines.push('[서초점 매장재고]\n')
        lines.push('•금옥팥죽')
        lines.push(`${f.patjuk}\n`)
        lines.push('•단팥죽')
        lines.push(`${f.sweetPatjuk}\n`)
        lines.push('•단호박죽')
        lines.push(`${f.sweetPumkin}\n`)
        lines.push('•빙수밭')
        lines.push(`${f.bingsuPat}\n`)
        lines.push('•빙수떡')
        lines.push(`${f.bingsuTteok}\n`)
        lines.push('•원두')
        lines.push(`${f.coffee}\n`)
        lines.push(`\n${f.addContent}\n`)
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
                <Fields>
                    <Field key="patjuk">
                        <Label>
                            <Title>금옥팥죽</Title>
                            <FeedbackLabel>
                                <Textarea
                                    name="patjuk"
                                    value={form.patjuk}
                                    onChange={handleChange}
                                />
                            </FeedbackLabel>
                        </Label>
                    </Field>
                    <Field key="sweetPatjuk">
                        <Label>
                            <Title>단팥죽</Title>
                            <FeedbackLabel>
                                <Textarea
                                    name="sweetPatjuk"
                                    value={form.sweetPatjuk}
                                    onChange={handleChange}
                                />
                            </FeedbackLabel>
                        </Label>
                    </Field>
                    <Field key="sweetPumkin">
                        <Label>
                            <Title>단호박죽</Title>
                            <FeedbackLabel>
                                <Textarea
                                    name="sweetPumkin"
                                    value={form.sweetPumkin}
                                    onChange={handleChange}
                                />
                            </FeedbackLabel>
                        </Label>
                    </Field>
                    <Field key="bingsuPat">
                        <Label>
                            <Title>빙수팥</Title>
                            <FeedbackLabel>
                                <Textarea
                                    name="bingsuPat"
                                    value={form.bingsuPat}
                                    onChange={handleChange}
                                />
                            </FeedbackLabel>
                        </Label>
                    </Field>
                    <Field key="bingsuTteok">
                        <Label>
                            <Title>빙수떡</Title>
                            <FeedbackLabel>
                                <Textarea
                                    name="bingsuTteok"
                                    value={form.bingsuTteok}
                                    onChange={handleChange}
                                />
                            </FeedbackLabel>
                        </Label>
                    </Field>
                    <Field key="coffee">
                        <Label>
                            <Title>원두</Title>
                            <FeedbackLabel>
                                <Textarea
                                    name="coffee"
                                    value={form.coffee}
                                    onChange={handleChange}
                                />
                            </FeedbackLabel>
                        </Label>
                    </Field>
                    <Field key="addContent">
                        <Label>
                            <Title>추가내용</Title>
                            <FeedbackLabel>
                                <Textarea
                                    name="addContent"
                                    value={form.addContent}
                                    onChange={handleChange}
                                />
                            </FeedbackLabel>
                        </Label>
                    </Field>
                </Fields>
            </FormWrapper>

            <Preview
                ref={previewRef}
                submitted={submitted}
                setCopied={setCopied}
                copied={copied}
                setSubmitted={setSubmitted}
                initialForm={initialForm}
                setForm={setForm}
                storageKey={STORAGE_KEY}
            />

            <FixedSubmit type="button" onClick={handleSubmit}>
                제출
            </FixedSubmit>
        </Container>
    )
}
