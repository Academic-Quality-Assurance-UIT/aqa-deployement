"use client";

import { useGetSurveySemesterListQuery } from "@/gql/graphql";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@heroui/react";
import { useEffect, useRef } from "react";
import OptionButton from "../OptionButton";

export default function StaffSurveySemesterSelector({
    semester,
    setSemester,
    isNoBorder = false,
}: {
    semester?: string;
    setSemester: (semester?: string) => void;
    isNoBorder?: boolean;
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { data } = useGetSurveySemesterListQuery();

    const currentSelectedRef = useRef<any>();

    const semesters = data?.getSurveySemesterList ?? [];
    const hasValue = Boolean(semester);
    const buttonText = semester || "Tất cả học kỳ";

    useEffect(() => {
        if (currentSelectedRef.current) {
            currentSelectedRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [isOpen]);

    return (
        <>
            <OptionButton
                onPress={onOpen}
                hasValue={hasValue}
                isNoBorder={isNoBorder}
            >
                {buttonText}
            </OptionButton>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                scrollBehavior="inside"
                backdrop="blur"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <p>Chọn học kỳ (Khảo sát CBNV)</p>
                            </ModalHeader>
                            <ModalBody className="pb-8 pt-3">
                                {[
                                    { display_name: "Tất cả học kỳ", value: "" },
                                    ...semesters.map((s: string) => ({
                                        display_name: s,
                                        value: s,
                                    })),
                                ].map(({ display_name, value }) => (
                                    <Button
                                        ref={
                                            value === semester
                                                ? currentSelectedRef
                                                : null
                                        }
                                        onPress={() => {
                                            setSemester(value || undefined);
                                            onClose();
                                        }}
                                        variant={
                                            value === semester
                                                ? "shadow"
                                                : "flat"
                                        }
                                        color={
                                            value === semester
                                                ? "primary"
                                                : "default"
                                        }
                                        className={`py-5`}
                                        key={value}
                                    >
                                        <p className="font-medium">{display_name}</p>
                                    </Button>
                                ))}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
