import useBreakpoint from "@site/src/hooks/useBreakpoint";
import React, {useMemo, useState} from "react";
import {getContributors} from "@site/src/api/contributor";
import {chunk} from "lodash-es";
import {Button} from "@site/src/components/ui/Button";

import {cn} from "@site/src/utils/class-utils";
import {useQuery} from "react-query";
import Spinner from "@site/src/components/ui/Spinner";
import Translate from '@docusaurus/Translate';

const ContributorList = () => {
    const size = useBreakpoint();
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const toggleContributeList = () => setIsExpand((x: boolean) => !x);

    const {data, isLoading} = useQuery("contributors", () => getContributors());

    const showCount = useMemo(() => {
        switch (size) {
            case "md":
            case "sm":
            case "xs":
                return 4;
            default:
                return 8;
        }
    }, [size]);

    const showColumnCount = useMemo(() => {
        switch (size) {
            case "md":
            case "sm":
            case "xs":
                return 3;
            default:
                return 2;
        }
    }, [size]);

    const userChunks = useMemo(() => {
        return chunk(data, showCount);
    }, [data, showCount]);

    return (
        <Spinner loading={isLoading}>
            <div className="border-border border rounded-md overflow-hidden">
                <table className="border-collapse">
                    <tbody>
                    {(isExpand ? userChunks : userChunks.slice(0, showColumnCount)).map(
                        (chunk, index) => (
                            <tr key={`tr_${index}`} className="border-0">
                                {chunk
                                    .concat(Array(3).fill({}))
                                    .slice(0, showCount)
                                    .map((user, index) => (
                                        <td
                                            key={user?.id}
                                            className={cn(
                                                "w-[95px] h-[120px] bg-card border-b border-t-0 border-l-0 border-border border-r",
                                            )}
                                        >
                                            <img
                                                className="w-[64px] h-[64px] rounded-full"
                                                src={user.avatar_url}
                                                alt={user.login}
                                            />
                                            <div className="w-[64px] mt-[6px] text-sm truncate">
                                                {user.login}
                                            </div>
                                        </td>
                                    ))}
                            </tr>
                        )
                    )}
                    </tbody>
                </table>
                <div className="flex justify-center mb-4">
                    {userChunks && userChunks.length ? (
                        <Button
                            className="bg-brand-muted text-brand"
                            onClick={toggleContributeList}
                        >
                            {isExpand ? <Translate id="home.contributors.collapse.button">收起所有贡献者</Translate> :
                                <Translate id="home.contributors.expand.button">展开所有贡献者</Translate>}
                        </Button>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </Spinner>
    );
};

export default ContributorList;
